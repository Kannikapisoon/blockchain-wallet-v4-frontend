import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import {
  Button,
  Link,
  HeartbeatLoader,
  Text,
  TooltipHost
} from 'blockchain-info-components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'
import ComboDisplay from 'components/Display/ComboDisplay'

const Wrapper = styled.div``
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 0;

  & > * {
    width: 150px;
  }
  & > :last-child {
    width: 100%;
  }
  &:first-child {
    padding-top: 0px;
  }
`
const Summary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme['gray-1']};
  padding: 10px 0;
  margin: 5px 0;
  margin-bottom: 25px;

  & > * {
    padding: 10px 0;
  }
`
const Footer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  & > :first-child {
    margin-bottom: 15px;
  }
`
const CoinTooltipHost = styled(TooltipHost)`
  overflow: hidden;
`
const CoinText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
`

const Success = props => {
  const {
    submitting,
    coin,
    fromAddress,
    toAddress,
    description,
    memo,
    memoType,
    amount,
    fee,
    total,
    handleBack,
    handleSubmit
  } = props

  return (
    <Wrapper>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage
            id='modals.sendxlm.secondstep.from'
            defaultMessage='From:'
          />
        </Text>
        <Text size='16px' weight={300} data-e2e='xlmFromWallet'>
          {fromAddress}
        </Text>
      </Row>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage
            id='modals.sendxlm.secondstep.to'
            defaultMessage='To:'
          />
        </Text>
        <CoinTooltipHost id='sendxlm.addr' tip={toAddress}>
          <CoinText size='16px' weight={300} data-e2e='xlmToAddress'>
            {toAddress}
          </CoinText>
        </CoinTooltipHost>
      </Row>
      {description && (
        <Row>
          <Text size='16px' weight={500}>
            <FormattedMessage
              id='modals.sendxlm.secondstep.note'
              defaultMessage='Note:'
            />
          </Text>
          <Text size='16px' weight={300} data-e2e='xlmSendDescription'>
            {description}
          </Text>
        </Row>
      )}
      {memo && (
        <Row>
          <Text size='16px' weight={500} data-e2e='xlmSendMemo'>
            <FormattedMessage
              id='modals.sendxlm.secondstep.memo'
              defaultMessage='Memo'
            />
          </Text>
          <Text size='16px' weight={300}>
            {` ${memoType}: ${memo}`}
          </Text>
        </Row>
      )}
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage
            id='modals.sendxlm.secondstep.payment'
            defaultMessage='Payment:'
          />
        </Text>
        <Text size='16px' weight={300}>
          <ComboDisplay coin={coin}>{amount}</ComboDisplay>
        </Text>
      </Row>
      <Row>
        <Text size='16px' weight={500}>
          <FormattedMessage
            id='modals.sendxlm.secondstep.fee'
            defaultMessage='Fee:'
          />
        </Text>
        <Text size='16px' weight={300}>
          <ComboDisplay coin={coin}>{fee}</ComboDisplay>
        </Text>
      </Row>
      <Summary>
        <Text size='16px' weight={300} color='sent'>
          <FormattedMessage
            id='modals.sendxlm.secondstep.total'
            defaultMessage='Total'
          />
        </Text>
        <CoinDisplay coin={coin} size='30px' weight={600} color='sent'>
          {total}
        </CoinDisplay>
        <FiatDisplay coin={coin} size='20px' weight={300} color='sent'>
          {total}
        </FiatDisplay>
      </Summary>
      <Footer>
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          nature='primary'
          fullwidth
          data-e2e='xlmSendSubmitButton'
        >
          {!submitting ? (
            <FormattedMessage
              id='modals.sendxlm.secondstep.send'
              defaultMessage='Send Stellar'
            />
          ) : (
            <HeartbeatLoader height='20px' width='20px' color='white' />
          )}
        </Button>
        <Link
          onClick={!submitting && handleBack}
          disabled={submitting}
          size='13px'
          weight={300}
          data-e2e='xlmSendBackLink'
        >
          <FormattedMessage
            id='modals.sendxlm.sendconfirm.back'
            defaultMessage='Go Back'
          />
        </Link>
      </Footer>
    </Wrapper>
  )
}

export default Success
