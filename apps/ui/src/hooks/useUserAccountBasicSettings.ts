import {
  type MeasurementFormat,
  type NumberFormat,
  type UiTheme,
} from '@repo/codegen/model';
import { useUserStore } from '@src/providers/use-store-provider';
import { useOptimistic, useTransition } from 'react';

export const useUserAccountBasicSettings = () => {
  const settings = useUserStore((state) => state);
  const [isPending, startTransition] = useTransition();
  const [optimisticUiTheme, addOptimisticUiTheme] = useOptimistic(
    settings.uiTheme,
    (_, nextUiTheme: UiTheme) => nextUiTheme,
  );
  const [optimisticMeasurementFormat, addOptimisticMeasurementFormat] =
    useOptimistic(
      settings.measurementFormat,
      (_, nextMeasurementFormat: MeasurementFormat) => nextMeasurementFormat,
    );
  const [optimisticNumberFormat, addOptimisticNumberFormat] = useOptimistic(
    settings.numberFormat,
    (_, nextNumberFormat: NumberFormat) => nextNumberFormat,
  );

  const updateUiTheme = (uiTheme: UiTheme) => {
    startTransition(async () => {
      addOptimisticUiTheme(uiTheme);
      try {
        await settings.setUiTheme(uiTheme);
      } catch (error) {
        console.error('Update failed', error);
      }
    });
  };

  const updateMeasurementFormat = (measurementFormat: MeasurementFormat) => {
    startTransition(async () => {
      addOptimisticMeasurementFormat(measurementFormat);
      try {
        await settings.setMeasurementFormat(measurementFormat);
      } catch (error) {
        console.error('Update failed', error);
      }
    });
  };

  const updateNumberFormat = (numberFormat: NumberFormat) => {
    startTransition(async () => {
      addOptimisticNumberFormat(numberFormat);
      try {
        await settings.setNumberFormat(numberFormat);
      } catch (error) {
        console.error('Update failed', error);
      }
    });
  };

  return {
    isPending,
    optimisticUiTheme,
    updateUiTheme,
    optimisticMeasurementFormat,
    updateMeasurementFormat,
    optimisticNumberFormat,
    updateNumberFormat,
  };
};
