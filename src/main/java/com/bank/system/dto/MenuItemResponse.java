package com.bank.system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemResponse {
    private String id;
    private String title;
    private String path;
    private String icon;
    private String badge;
    private String category;
    private Integer order;
    private List<String> roles;
    private List<MenuItemResponse> children;
}
