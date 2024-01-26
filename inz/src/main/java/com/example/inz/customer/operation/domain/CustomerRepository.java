package com.example.inz.customer.operation.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByLogin(String login);

    @Query("SELECT c FROM Customer c WHERE c.login = :login2")
    Optional<Customer> findByLoginCat(@Param("login2") String login);

    @Transactional
    @Modifying
    @Query("UPDATE Customer c SET c.is_active = false WHERE c.login = :login2")
    void deactivateCustomerByLogin(@Param("login2") String login);

    @Transactional
    @Modifying
    @Query("UPDATE Customer c SET c.is_active = true WHERE c.login = :login2")
    void activateCustomerByLogin(@Param("login2") String login);

}
