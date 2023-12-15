package com.example.inz.task.provider;

import com.example.inz.task.provider.domain.TaskProviderFacade;
import com.example.inz.task.provider.dto.TaskDto;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class TaskController {

    TaskProviderFacade taskProviderFacade;

    @Autowired
    public TaskController(TaskProviderFacade taskProviderFacade) {
        this.taskProviderFacade = taskProviderFacade;
    }

    @PostMapping(value = "/addTask", produces = "application/json")
    @Operation(summary = "add new task")
    public ResponseEntity<TaskDto> addTask(@RequestBody TaskDto taskDto) {
        TaskDto task = taskProviderFacade.saveTask(taskDto);
        return ResponseEntity.ok(task);
    }
}
