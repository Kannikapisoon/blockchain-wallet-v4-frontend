import * as coreTypes from 'blockchain-wallet-v4/src/redux/actionTypes'
import * as router from 'connected-react-router'
import * as types from '../data/actionTypes'
import * as R from 'ramda'

const rootDocumentRoutes = [`/login`, `/recover`, `/security-center`, `/signup`]

const alreadyForwarded = ({ meta }) => meta && meta.forwarded

const tag = action => ({
  ...action,
  meta: { ...action.meta, forwarded: true }
})

const appElement = document.getElementById(`app`)
const frameElement = document.getElementById(`frame`)
const mainProcessElement = document.getElementById(`main-process`)

const displayRootDocument = () => {
  appElement.style.display = `block`
  frameElement.style.borderColor = `lightgreen`
  mainProcessElement.style.display = `none`
}

const displayMainProcess = () => {
  appElement.style.display = `none`
  frameElement.style.borderColor = `red`
  mainProcessElement.style.display = `block`
}

const dispatchToBoth = ({ mainProcessDispatch, next }, action) => {
  if (!alreadyForwarded(action)) {
    mainProcessDispatch(action)
  }

  next(action)
}

const wrapperMask = {
  password: undefined,
  wallet: {
    guid: undefined,
    hd_wallets: [{ seedHex: undefined }]
  }
}

const handlers = {
  // Fetching the logs requires the GUID.
  [coreTypes.data.misc.FETCH_LOGS_FAILURE]: dispatchToBoth,
  [coreTypes.data.misc.FETCH_LOGS_LOADING]: dispatchToBoth,
  [coreTypes.data.misc.FETCH_LOGS_SUCCESS]: dispatchToBoth,

  // Fetching the settings requires the GUID.
  [coreTypes.settings.FETCH_SETTINGS_FAILURE]: dispatchToBoth,
  [coreTypes.settings.FETCH_SETTINGS_LOADING]: dispatchToBoth,
  [coreTypes.settings.FETCH_SETTINGS_SUCCESS]: dispatchToBoth,

  // Report failure of wallet synchronization.
  [coreTypes.walletSync.SYNC_ERROR]: dispatchToBoth,

  // Report success of wallet synchronization.
  [coreTypes.walletSync.SYNC_SUCCESS]: dispatchToBoth,

  // Proceed with the login routine after receiving the payload.
  [types.auth.LOGIN_ROUTINE]: dispatchToBoth
}

// Used to set the wrapper in /recover.

// We're not ready for this yet.
//
// handlers[coreTypes.wallet.REFRESH_WRAPPER] = (
//   { mainProcessDispatch, next },
//   action
// ) => {
//   const redactedPayload = action.payload.mergeDeep(wrapperMask)
//   mainProcessDispatch({ ...action, payload: redactedPayload })
//   next(action)
// }

handlers[coreTypes.wallet.REFRESH_WRAPPER] = dispatchToBoth

// Send the wrapper to the Main Process after logging in.
handlers[coreTypes.wallet.SET_WRAPPER] =
  handlers[coreTypes.wallet.REFRESH_WRAPPER]

handlers[router.LOCATION_CHANGE] = (
  { mainProcessDispatch, next, store },
  action
) => {
  const { pathname } = action.payload.location

  if (rootDocumentRoutes.some(route => pathname.startsWith(route))) {
    displayRootDocument()

    if (
      alreadyForwarded(action) &&
      pathname !== store.getState().router.location.pathname
    ) {
      return next(router.replace(pathname))
    }
  } else {
    displayMainProcess()
    mainProcessDispatch(action)
  }

  next(action)
}

export default mainProcessDispatch => {
  return store => next => action => {
    const { type } = action

    const context = {
      mainProcessDispatch: R.pipe(
        tag,
        mainProcessDispatch
      ),
      next,
      store
    }

    if (type in handlers) {
      return handlers[type](context, action)
    } else {
      return next(action)
    }
  }
}
