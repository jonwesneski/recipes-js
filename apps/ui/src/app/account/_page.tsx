'use client'

import type {
  MeasurementFormat,
  NumberFormat,
  UiTheme,
  UserFollowersPaginationResponse,
} from '@repo/codegen/model'
import {
  useUsersControllerFollowUserV1,
  useUsersControllerUpdateUserAccountV1,
} from '@repo/codegen/users'
import { RadioGroup, TextButton, TextLabel, Toggle } from '@repo/design-system'
import { ProfilePic } from '@src/components'
import { NutritionalFactsInput } from '@src/components/NutritionalFactsInput'
import { Tab, Tabs } from '@src/components/tabs'
import { useUserStore } from '@src/providers/use-store-provider'
import { useCallback, useState } from 'react'

interface IAccountProps {
  followers: UserFollowersPaginationResponse
}
const Account = (props: IAccountProps) => {
  const settings = useUserStore((state) => state)
  const [handle, setHandle] = useState(settings.handle)
  const [toggleFollowers, setToggleFollowers] = useState<boolean[]>(
    props.followers.data.map(() => true),
  )

  const { mutateAsync: updateFollow } = useUsersControllerFollowUserV1({
    mutation: { retry: false },
  })

  const { mutateAsync: updateAccount } = useUsersControllerUpdateUserAccountV1({
    mutation: { retry: false },
  })

  const handleUpdateHandle = useCallback(async () => {
    await settings.setHandle(handle)
  }, [handle, settings.setHandle])

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
        <Tab label="Followers">
          <>
            {props.followers.data.map((follower, i) => (
              <div key={follower.id} className="p-2 border-b">
                <div className="flex justify-between">
                  <div className="flex">
                    <ProfilePic
                      className="mr-2"
                      handle={follower.handle}
                      imageUrl={follower.imageUrl}
                    />
                    <span>{follower.handle}</span>
                  </div>
                  <Toggle
                    initialIsOn
                    onClickAsync={async () => {
                      const expected = !toggleFollowers[i]
                      await updateFollow({
                        id: follower.id,
                        data: { follow: expected },
                      })
                      setToggleFollowers((prev) => {
                        const newToggles = [...prev]
                        newToggles[i] = expected
                        return newToggles
                      })
                      return expected
                    }}
                  />
                </div>
              </div>
            ))}
          </>
        </Tab>
        <Tab label="Daily Nutrition">
          <NutritionalFactsInput />
        </Tab>
      </Tabs>
    </div>
  )
}
export default Account
