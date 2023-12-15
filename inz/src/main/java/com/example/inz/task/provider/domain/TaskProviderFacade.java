package com.example.inz.task.provider.domain;

import com.example.inz.category.domain.Category;
import com.example.inz.category.domain.CategoryRepository;
import com.example.inz.customer.operation.domain.Customer;
import com.example.inz.customer.operation.domain.CustomerRepository;
import com.example.inz.customer.operation.exception.UserNotFoundException;
import com.example.inz.task.provider.dto.TaskDto;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.util.Optional;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TaskProviderFacade {

    TaskRepository taskRepository;
    CategoryRepository categoryRepository;
    CustomerRepository customerRepository;

    @Autowired
    public TaskProviderFacade(TaskRepository taskRepository, CategoryRepository categoryRepository, CustomerRepository customerRepository) {
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
        this.customerRepository = customerRepository;
    }


    public TaskDto saveTask(TaskDto taskDto) {
        Optional<Task> optionalCategory = taskRepository.findByName(taskDto.getName());

        if (optionalCategory.isPresent()) {
            throw new UserNotFoundException("Task already exists", HttpStatus.BAD_REQUEST);
        }

        Optional<Category> categoryId = categoryRepository.findByName(taskDto.getCategory());
        if (categoryId.isEmpty()) {
            throw new UserNotFoundException("Error with category", HttpStatus.BAD_REQUEST);
        }

        Optional<Customer> customerId = customerRepository.findByLogin(taskDto.getUser());
        if (customerId.isEmpty()) {
            throw new UserNotFoundException("Error with user", HttpStatus.BAD_REQUEST);
        }

        Task savedTask = taskRepository.save(Task.builder()
                .name(taskDto.getName())
                .category(categoryId.get())
                .user(customerId.get())
                .isActive(false)
                .build());

        return TaskDto.builder().name(savedTask.getName()).build();
    }
}
