package com.elevanda.school_client_backend.controller;

import com.elevanda.school_client_backend.common.PaginatedResponse;
import com.elevanda.school_client_backend.common.StandardApiResponse;
import com.elevanda.school_client_backend.dto.ScheduleRequestDTO;
import com.elevanda.school_client_backend.dto.ScheduleResponseDTO;
import com.elevanda.school_client_backend.service.ScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    @Operation(summary = "Create schedule", tags = {"Schedule Management"})
    @PostMapping
    public ResponseEntity<StandardApiResponse<ScheduleResponseDTO>> createSchedule(@Valid @RequestBody ScheduleRequestDTO request) {
        ScheduleResponseDTO response = scheduleService.createSchedule(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new StandardApiResponse<>(true, "Schedule created successfully", response));
    }

    @Operation(summary = "Get schedule by ID", tags = {"Schedule Management"})
    @GetMapping("/{id}")
    public ResponseEntity<StandardApiResponse<ScheduleResponseDTO>> getScheduleById(@PathVariable Long id) {
        ScheduleResponseDTO response = scheduleService.getScheduleById(id);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Schedule retrieved successfully", response));
    }

    @Operation(summary = "Get all schedules", tags = {"Schedule Management"})
    @GetMapping
    public ResponseEntity<StandardApiResponse<PaginatedResponse<ScheduleResponseDTO>>> getAllSchedules(Pageable pageable) {
        Page<ScheduleResponseDTO> page = scheduleService.getAllSchedules(pageable);
        PaginatedResponse<ScheduleResponseDTO> response = PaginatedResponse.<ScheduleResponseDTO>builder()
                .content(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Schedules retrieved successfully", response));
    }

    @Operation(summary = "Get schedules by class", tags = {"Schedule Management"})
    @GetMapping("/class/{classId}")
    public ResponseEntity<StandardApiResponse<List<ScheduleResponseDTO>>> getSchedulesByClassId(@PathVariable Long classId) {
        List<ScheduleResponseDTO> schedules = scheduleService.getSchedulesByClassId(classId);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Schedules retrieved successfully", schedules));
    }

    @Operation(summary = "Get schedules by teacher", tags = {"Schedule Management"})
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<StandardApiResponse<List<ScheduleResponseDTO>>> getSchedulesByTeacherId(@PathVariable Long teacherId) {
        List<ScheduleResponseDTO> schedules = scheduleService.getSchedulesByTeacherId(teacherId);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Schedules retrieved successfully", schedules));
    }

    @Operation(summary = "Update schedule", tags = {"Schedule Management"})
    @PutMapping("/{id}")
    public ResponseEntity<StandardApiResponse<ScheduleResponseDTO>> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody ScheduleRequestDTO request) {
        ScheduleResponseDTO response = scheduleService.updateSchedule(id, request);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Schedule updated successfully", response));
    }

    @Operation(summary = "Delete schedule", tags = {"Schedule Management"})
    @DeleteMapping("/{id}")
    public ResponseEntity<StandardApiResponse<Void>> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(new StandardApiResponse<>(true, "Schedule deleted successfully", null));
    }
}
