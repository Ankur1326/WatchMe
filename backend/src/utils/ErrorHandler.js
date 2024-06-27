import { ApiError } from "./ApiError.js";

function stripHtmlTags(str) {
    return str.replace(/<[^>]*>?/gm, '');
}

const errorHandler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        let errors = err.errors;

        if (Array.isArray(errors)) {
            errors = errors.map(stripHtmlTags);
        } else if (typeof errors === 'string') {
            errors = stripHtmlTags(errors);
        } else {
            errors = '';
        }

        const cleanMessage = stripHtmlTags(err.message);

        return res.status(err.statusCode).json({
            success: err.success,
            message: cleanMessage,
            errors: errors,
        });
    }

    console.error("error hendler ", err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};

export { errorHandler };
