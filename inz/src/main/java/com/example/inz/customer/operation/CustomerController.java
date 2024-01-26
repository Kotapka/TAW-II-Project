package com.example.inz.customer.operation;

import com.example.inz.configuration.UserAuthenticationProvider;
import com.example.inz.customer.operation.domain.CustomerOperationFacade;
import com.example.inz.customer.operation.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(path = "/api")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerController {

    private final CustomerOperationFacade customerOperationFacade;
    private final UserAuthenticationProvider userAuthenticationProvider;

    @Autowired
    public CustomerController(CustomerOperationFacade customerOperationFacade, UserAuthenticationProvider userAuthenticationProvider) {
        this.customerOperationFacade = customerOperationFacade;
        this.userAuthenticationProvider = userAuthenticationProvider;
    }

    @PostMapping(value = "/login", produces = "application/json")
    @Operation(summary = "Login user to application")
    public ResponseEntity<CustomerDto> login(@RequestBody LoginDto loginDto) {
        CustomerDto customer = customerOperationFacade.login(loginDto);
        customer.setToken(userAuthenticationProvider.createToken(customer.getLogin()));

        return ResponseEntity.created(URI.create("/users/" + customer.getId())).body(customer);
    }

    @PostMapping(value = "/register", produces = "application/json")
    @Operation(summary = "Register new user to application")
    public ResponseEntity<CustomerDto> register(@RequestBody SignUpDto signUpDto) {
        CustomerDto customer = customerOperationFacade.register(signUpDto);
        customer.setToken(userAuthenticationProvider.createToken(customer.getLogin()));

        return ResponseEntity.created(URI.create("/users/" + customer.getId())).body(customer);
    }

    @GetMapping(value = "/getUsers", produces = "application/json")
    @Operation(summary = "Register new user to application")
    public ResponseEntity<List<UserListDto>> getUsers() {
        List<UserListDto> userList = customerOperationFacade.getUsers();
        return ResponseEntity.ok(userList);
    }

    @PostMapping(value = "/setActiveFalse", produces = "application/json")
    @Operation(summary = "Register new user to application")
    public ResponseEntity<UserLoginDto> setActiveFalse(@RequestBody UserLoginDto loginDto) {
        customerOperationFacade.setActiveFalse(loginDto);
        return ResponseEntity.ok(loginDto);
    }

    @PostMapping(value = "/setActiveTrue", produces = "application/json")
    @Operation(summary = "Register new user to application")
    public ResponseEntity<UserLoginDto> setActiveTrue(@RequestBody UserLoginDto loginDto) {
        customerOperationFacade.setActiveTrue(loginDto);
        return ResponseEntity.ok(loginDto);
    }
}
