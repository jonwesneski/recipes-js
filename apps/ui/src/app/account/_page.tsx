'use client'

import type {
  MeasurementFormat,
  NumberFormat,
  NutritionalFactsResponse,
  UiTheme,
  UserFollowingsPaginationResponse,
} from '@repo/codegen/model'
import { useUsersControllerUpdateUserAccountV1 } from '@repo/codegen/users'
import { RadioGroup, TextButton, TextLabel } from '@repo/design-system'
import { NutritionalFactsInput } from '@src/components/NutritionalFactsInput'
import { Tab, Tabs } from '@src/components/tabs'
import { useUserStore } from '@src/providers/use-store-provider'
import { useCallback, useState } from 'react'
import Followings from './_components/Followings'

interface IAccountProps {
  followings: UserFollowingsPaginationResponse
}
const Account = (props: IAccountProps) => {
  const settings = useUserStore((state) => state)
  const [handle, setHandle] = useState(settings.handle)

  const { mutateAsync: updateAccount } = useUsersControllerUpdateUserAccountV1({
    mutation: { retry: false },
  })

  const handleUpdateHandle = useCallback(async () => {
    await settings.setHandle(handle)
  }, [handle, settings.setHandle])

  const handleNutritionalFactChange = (
    data: Partial<NutritionalFactsResponse>,
  ) => {
    settings.setPartialCustomNutritionalFacts(data)
  }

  const handleUpdateNutritionalFacts = async () => {
    const data = settings.makeDailyNurtitionUserAccountDto()
    await updateAccount({ data })
  }

  return (
    <div>
      <h2 className="font-bold">Account</h2>

      <div className="flex gap-4 mt-6">
        <TextLabel
          isRequired={false}
          label="handle"
          name="handle"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
        <TextButton
          text="Update handle"
          onClick={() => void handleUpdateHandle()}
        />
      </div>
      <div className="my-6">
        <h6 className="text-center">Theme</h6>
        <RadioGroup
          selectedValue={settings.uiTheme}
          onChange={(value) => void settings.setUiTheme(value as UiTheme)}
          options={[
            { label: 'light', value: 'light' },
            { label: 'dark', value: 'dark' },
            { label: 'system', value: 'system' },
          ]}
        />

        <h6 className="text-center">Unit Format</h6>
        <RadioGroup
          selectedValue={settings.measurementFormat}
          onChange={(value) =>
            void settings.setMeasurementFormat(value as MeasurementFormat)
          }
          options={[
            { label: 'default', value: 'default' },
            { label: 'imperial', value: 'imperial' },
            { label: 'metric', value: 'metric' },
          ]}
        />

        <h6 className="text-center">Number Format</h6>
        <RadioGroup
          selectedValue={settings.numberFormat}
          onChange={(value) =>
            void settings.setNumberFormat(value as NumberFormat)
          }
          options={[
            { label: 'default', value: 'default' },
            { label: 'decimal', value: 'decimal' },
            { label: 'fraction', value: 'fraction' },
          ]}
        />
      </div>
      <Tabs>
        <Tab label="Followings">
          <Followings followings={props.followings} />
        </Tab>
        <Tab label="Daily Nutrition">
          <NutritionalFactsInput
            nutritionalFacts={
              settings.customDailyNutrition ??
              settings.predefinedDailyNutrition?.nutritionalFacts ??
              null
            }
            onNutritionalFactChange={handleNutritionalFactChange}
          />
          <TextButton
            text="update nutritional facts"
            onClick={() => void handleUpdateNutritionalFacts()}
          />
        </Tab>
      </Tabs>
    </div>
  )
}
export default Account
