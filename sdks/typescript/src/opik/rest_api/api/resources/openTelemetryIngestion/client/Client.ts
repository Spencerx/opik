/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as environments from "../../../../environments";
import * as core from "../../../../core";
import urlJoin from "url-join";
import * as errors from "../../../../errors/index";

export declare namespace OpenTelemetryIngestion {
    export interface Options {
        environment?: core.Supplier<environments.OpikApiEnvironment | string>;
        /** Specify a custom URL to connect the client to. */
        baseUrl?: core.Supplier<string>;
        /** Override the Authorization header */
        apiKey?: core.Supplier<string | undefined>;
        /** Override the Comet-Workspace header */
        workspaceName?: core.Supplier<string | undefined>;
    }

    export interface RequestOptions {
        /** The maximum time to wait for a response in seconds. */
        timeoutInSeconds?: number;
        /** The number of times to retry the request. Defaults to 2. */
        maxRetries?: number;
        /** A hook to abort the request. */
        abortSignal?: AbortSignal;
        /** Override the Authorization header */
        apiKey?: string | undefined;
        /** Override the Comet-Workspace header */
        workspaceName?: string | undefined;
        /** Additional headers to include in the request. */
        headers?: Record<string, string>;
    }
}

/**
 * Resource to ingest Traces and Spans via OpenTelemetry
 */
export class OpenTelemetryIngestion {
    constructor(protected readonly _options: OpenTelemetryIngestion.Options = {}) {}

    /**
     * @param {OpenTelemetryIngestion.RequestOptions} requestOptions - Request-specific configuration.
     *
     * @example
     *     await client.openTelemetryIngestion.receiveProtobufTraces()
     */
    public receiveProtobufTraces(
        requestOptions?: OpenTelemetryIngestion.RequestOptions,
    ): core.HttpResponsePromise<unknown> {
        return core.HttpResponsePromise.fromPromise(this.__receiveProtobufTraces(requestOptions));
    }

    private async __receiveProtobufTraces(
        requestOptions?: OpenTelemetryIngestion.RequestOptions,
    ): Promise<core.WithRawResponse<unknown>> {
        const _response = await core.fetcher({
            url: urlJoin(
                (await core.Supplier.get(this._options.baseUrl)) ??
                    (await core.Supplier.get(this._options.environment)) ??
                    environments.OpikApiEnvironment.Default,
                "v1/private/otel/v1/traces",
            ),
            method: "POST",
            headers: {
                "Comet-Workspace":
                    (await core.Supplier.get(this._options.workspaceName)) != null
                        ? await core.Supplier.get(this._options.workspaceName)
                        : undefined,
                "X-Fern-Language": "JavaScript",
                "X-Fern-Runtime": core.RUNTIME.type,
                "X-Fern-Runtime-Version": core.RUNTIME.version,
                ...(await this._getCustomAuthorizationHeaders()),
                ...requestOptions?.headers,
            },
            contentType: "application/json",
            requestType: "json",
            timeoutMs: requestOptions?.timeoutInSeconds != null ? requestOptions.timeoutInSeconds * 1000 : 60000,
            maxRetries: requestOptions?.maxRetries,
            withCredentials: true,
            abortSignal: requestOptions?.abortSignal,
        });
        if (_response.ok) {
            return { data: _response.body, rawResponse: _response.rawResponse };
        }

        if (_response.error.reason === "status-code") {
            throw new errors.OpikApiError({
                statusCode: _response.error.statusCode,
                body: _response.error.body,
                rawResponse: _response.rawResponse,
            });
        }

        switch (_response.error.reason) {
            case "non-json":
                throw new errors.OpikApiError({
                    statusCode: _response.error.statusCode,
                    body: _response.error.rawBody,
                    rawResponse: _response.rawResponse,
                });
            case "timeout":
                throw new errors.OpikApiTimeoutError("Timeout exceeded when calling POST /v1/private/otel/v1/traces.");
            case "unknown":
                throw new errors.OpikApiError({
                    message: _response.error.errorMessage,
                    rawResponse: _response.rawResponse,
                });
        }
    }

    protected async _getCustomAuthorizationHeaders() {
        const apiKeyValue = await core.Supplier.get(this._options.apiKey);
        return { Authorization: apiKeyValue };
    }
}
