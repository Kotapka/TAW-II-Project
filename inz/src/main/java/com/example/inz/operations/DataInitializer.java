package com.example.inz.operations;

import com.example.inz.customer.operation.domain.Customer;
import com.example.inz.customer.operation.domain.CustomerOperationFacade;
import com.example.inz.customer.operation.domain.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public void run(String... args) throws Exception {
        addAdmin();
    }

    private void addAdmin() {
        Customer customer = Customer.builder().is_admin(true)
                .surname("admin")
                .login("admin")
                .password(MD5.getMd5("admin"))
                .name("admin")
                .is_active(true)
                .build();
        customerRepository.save(customer);
        }
}

