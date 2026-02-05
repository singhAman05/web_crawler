import { ERROR_MAP } from "./errorMap";

export type ErrorCode = keyof typeof ERROR_MAP;

export class AppError extends Error {
    public readonly status: number;
    public readonly code: ErrorCode;

    constructor(code: ErrorCode, details?: string) {
        super(
        details
            ? `${ERROR_MAP[code].message}: ${details}`
            : ERROR_MAP[code].message
        );

        this.code = code;
        this.status = ERROR_MAP[code].status;
    }
}
