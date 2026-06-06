import { IpcResponseStatusCodes } from "@shared/common/constants/ipc-channel.constant";
import type { IpcChannelResponse } from "@shared/common/types/ipc-channel.type";
import log from "electron-log/renderer";
import type z from "zod";

export async function invoke<ReqT, ResT>(
	channel: string,
	request: ReqT,
	responseResultSchema?: z.ZodType,
): Promise<IpcChannelResponse<ResT>> {
	try {
		const resp = (await window.electron.ipcRenderer.invoke(
			channel,
			request,
		)) as IpcChannelResponse<ResT>;

		const isValid = validateResponseData(resp, responseResultSchema);
		if (!isValid) {
			log.error(
				"Invalid response data, the response is not in the expected format",
			);
			log.error(JSON.stringify(resp, null, 2));
			return {
				success: false,
				data: null,
				statusCode: IpcResponseStatusCodes.UNPROCESSABLE_ENTITY,
				errorMessage:
					"Invalid response data, the response is not in the expected format",
			};
		}

		return resp;
	} catch (error) {
		console.error(error);
		return {
			success: false,
			data: null,
			statusCode: IpcResponseStatusCodes.INTERNAL_ERROR,
			errorMessage: "Unexpected error happened in the internal",
		};
	}
}

function validateResponseData<ResT>(
	response: IpcChannelResponse<ResT>,
	responseResultSchema?: z.ZodType,
): boolean {
	if (response.success && responseResultSchema) {
		return responseResultSchema.safeParse(response.data).success;
	}
	return true;
}
