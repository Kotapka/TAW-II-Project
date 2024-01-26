package com.example.inz.customer.operation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserListDto {
    private Long id;
    private String login;
    private String name;
    private String surname;
    private Boolean is_active;
}
