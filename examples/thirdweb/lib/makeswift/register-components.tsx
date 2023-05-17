import {
  Checkbox,
  Color,
  Select,
  Style,
  TextInput,
} from '@makeswift/runtime/controls'
import { ReactRuntime } from '@makeswift/runtime/react'
import { ChainId } from '@thirdweb-dev/react'

import { NFTDropCard } from '../../components'

ReactRuntime.registerComponent(NFTDropCard, {
  type: 'nft-drop',
  label: 'NFT Drop',
  props: {
    className: Style(),
    chainId: Select({
      label: 'Chain',
      options: Object.entries(ChainId)
        .filter(([key]) => Number.isInteger(parseInt(key, 10)))
        .map(([value, label]) => ({ label: label as string, value })),
      defaultValue: String(ChainId.Mumbai),
    }),
    contractAddress: TextInput({
      label: 'Contract Address',
      defaultValue: '0xe7E3781BdC8b525048c3FE83070bc49C143739AC',
    }),
    showMedia: Checkbox({
      label: 'Show media',
      defaultValue: true,
    }),
    showDescription: Checkbox({
      label: 'Show description',
      defaultValue: true,
    }),
    // showClaimed: Checkbox({ label: 'Show claimed', defaultValue: true }),
    totalClaimed: Select({
      label: 'Select Total Basis',
      options: [
        { label: 'No Total', value: 'nototal' },
        { label: 'Total Supply', value: 'total' },
        { label: 'Max Supply', value: 'max' },
        { lable: 'Available Supply', value: 'available' }
      ],
      defaultValue: 'total',
    }),
    buttonBgColor: Color({ label: 'Button bg', defaultValue: '#000000' }),
    buttonTextColor: Color({ label: 'Button text', defaultValue: '#FFFFFF' }),
  },
})
