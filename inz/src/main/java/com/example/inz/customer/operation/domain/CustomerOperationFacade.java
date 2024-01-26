package com.example.inz.customer.operation.domain;

import com.example.inz.customer.operation.dto.*;
import com.example.inz.customer.operation.exception.HttpException;
import com.example.inz.operations.MD5;
import com.example.inz.task.provider.domain.Task;
import com.example.inz.task.provider.dto.TaskDto;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CustomerOperationFacade {

    CustomerRepository customerRepository;
    CustomerMapper customerMapper;

    @Autowired
    public CustomerOperationFacade(CustomerRepository customerRepository,CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }
    public CustomerDto findByLogin(String login){
        Customer customer = customerRepository.findByLogin(login).orElseThrow(() -> new HttpException("User not found", HttpStatus.NOT_FOUND));
        return customerMapper.toCustomerDto(customer);
    }

    public CustomerDto login(LoginDto login) {
        Customer customer = customerRepository.findByLogin(login.getLogin())
                .orElseThrow(() -> new HttpException("Unknown user", HttpStatus.NOT_FOUND));

        if (customer.getIs_active() && customer.getPassword().equals(MD5.getMd5(login.getPassword()))) {
            return customerMapper.toCustomerDto(customer);
        }
        throw new HttpException("Invalid password", HttpStatus.BAD_REQUEST);
    }

    public CustomerDto register(SignUpDto userDto) {
        Optional<Customer> optionalUser = customerRepository.findByLogin(userDto.getLogin());

        if (optionalUser.isPresent()) {
            throw new HttpException("Login already exists", HttpStatus.BAD_REQUEST);
        }
        if (userDto.getLogin().isEmpty() || userDto.getPassword().isEmpty() || userDto.getName().isEmpty() || userDto.getSurname().isEmpty()){
            throw new HttpException("Wrong data", HttpStatus.BAD_REQUEST);
        }
        Customer customer = customerMapper.signUpToUser(userDto);
        customer.setPassword(MD5.getMd5(userDto.getPassword()));
        customer.setIs_admin(false);
        customer.setIs_active(true);

        Customer savedCustomer = customerRepository.save(customer);

        return customerMapper.toCustomerDto(savedCustomer);
    }

    public List<UserListDto> getUsers() {
        List<Customer> customerList = customerRepository.findAll();

        return customerList.stream()
                .map(this::mapToDto)
                .toList();
    }

    public UserLoginDto setActiveFalse(UserLoginDto loginDto) {
        if (Objects.equals(loginDto.getLogin(), "admin")){
            throw new HttpException("Wrong data", HttpStatus.BAD_REQUEST);
        }
        customerRepository.deactivateCustomerByLogin(loginDto.getLogin());
        return loginDto;
    }

    public UserLoginDto setActiveTrue(UserLoginDto loginDto) {
        customerRepository.activateCustomerByLogin(loginDto.getLogin());
        return loginDto;
    }

    private UserListDto mapToDto(Customer customer) {
        return UserListDto.builder()
                .name(customer.getName())
                .surname(customer.getSurname())
                .login(customer.getLogin())
                .id(customer.getId())
                .is_active(customer.getIs_active())
                .build();
    }
}
