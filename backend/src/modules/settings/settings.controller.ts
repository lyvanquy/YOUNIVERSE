import type { RequestHandler } from "express";

import { sendSuccess } from "../../common/utils/response";
import * as settingsService from "./settings.service";
import type { UpdatePaymentSettingInput } from "./settings.validation";

export const getPaymentSetting: RequestHandler = async (_req, res, next) => {
  try {
    const paymentSetting = await settingsService.getPaymentSetting();

    sendSuccess(res, {
      message: "OK",
      data: {
        paymentSetting,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePaymentSetting: RequestHandler = async (req, res, next) => {
  try {
    const paymentSetting = await settingsService.updatePaymentSetting(req.body as UpdatePaymentSettingInput);

    sendSuccess(res, {
      message: "Payment settings updated",
      data: {
        paymentSetting,
      },
    });
  } catch (error) {
    next(error);
  }
};
