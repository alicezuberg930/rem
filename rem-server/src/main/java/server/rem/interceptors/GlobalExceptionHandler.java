package server.rem.interceptors;

import org.springframework.dao.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.transaction.CannotCreateTransactionException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.HttpMediaTypeNotSupportedException;

import jakarta.validation.ConstraintViolationException;
import server.rem.dtos.APIResponse;
import server.rem.utils.exceptions.*;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<APIResponse<Void>> handleAccessDeniedError(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(APIResponse.error(HttpStatus.FORBIDDEN, "You do not have permission to access this resource"));
    }

    // Validation errors from @Valid annotations
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<APIResponse<Void>> handleConstraintViolationError(ConstraintViolationException ex) {
        String message = ex.getConstraintViolations()
                .stream()
                .map(v -> v.getMessage())
                .findFirst()
                .orElse("Validation failed");
        return ResponseEntity.badRequest().body(APIResponse.error(HttpStatus.BAD_REQUEST, message));
    }

    // Database connection failed
    @ExceptionHandler(CannotCreateTransactionException.class)
    public ResponseEntity<APIResponse<Void>> handleDatabaseConnectionError(CannotCreateTransactionException ex) {
        return ResponseEntity.status(503).body(APIResponse.error(HttpStatus.SERVICE_UNAVAILABLE, "Database connection failed, please try again later"));
    }

    // Generic database errors (query failed, timeout, etc.)
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<APIResponse<Void>> handleDataAccessError(DataAccessException ex) {
        return ResponseEntity.status(503).body(APIResponse.error(HttpStatus.SERVICE_UNAVAILABLE, "Database error occurred, please try again later"));
    }

    // Constraint violations (duplicate key, foreign key, etc.)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<APIResponse<Void>> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return ResponseEntity.status(409).body(APIResponse.error(HttpStatus.CONFLICT, "Data integrity violation"));
    }

    // Takes too long to query
    @ExceptionHandler(QueryTimeoutException.class)
    public ResponseEntity<APIResponse<Void>> handleQueryTimeout(QueryTimeoutException ex) {
        return ResponseEntity.status(409).body(APIResponse.error(HttpStatus.CONFLICT, "Query timeout"));
    }

    // Resource Not Found
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<APIResponse<Void>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(404).body(APIResponse.error(HttpStatus.NOT_FOUND, ex.getMessage()));
    }

    // Validation Errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse<Void>> handleValidationErrors(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(400).body(APIResponse.error(HttpStatus.BAD_REQUEST, message));
    }

    // Illegal Argument
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<APIResponse<Void>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(400).body(APIResponse.error(HttpStatus.BAD_REQUEST, ex.getMessage()));
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<APIResponse<Void>> handleUnsupportedMediaType(HttpMediaTypeNotSupportedException ex) {
        return ResponseEntity.status(415).body(APIResponse.error(HttpStatus.UNSUPPORTED_MEDIA_TYPE, ex.getMessage()));
    }

    // Forbidden
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<APIResponse<Void>> handleForbidden(ForbiddenException ex) {
        return ResponseEntity.status(403).body(APIResponse.error(HttpStatus.FORBIDDEN, ex.getMessage()));
    }

    // Unauthorized
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<APIResponse<Void>> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(401).body(APIResponse.error(HttpStatus.UNAUTHORIZED, ex.getMessage()));
    }

    // Conflict
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<APIResponse<Void>> handleConflict(ConflictException ex) {
        return ResponseEntity.status(409).body(APIResponse.error(HttpStatus.CONFLICT, ex.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<APIResponse<Void>> handleIllegalState(IllegalStateException ex) {
        if ("File storage is currently unavailable, please try again later".equals(ex.getMessage())) {
            return ResponseEntity.status(503).body(APIResponse.error(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage()));
        }
        return ResponseEntity.status(500).body(APIResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage()));
    }

    // Generic fallback
    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse<Void>> handleGenericException(Exception ex) {
        return ResponseEntity.status(500).body(APIResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage()));
    }
}
