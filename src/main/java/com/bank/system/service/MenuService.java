package com.bank.system.service;

import com.bank.system.dto.MenuItemResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuService {

    public List<MenuItemResponse> getNavbarMenuItems(String role) {
        List<MenuItemResponse> allItems = createDefaultMenuItems();

        if (role == null || role.trim().isEmpty()) {
            return allItems;
        }

        String normalizedRole = role.trim().toUpperCase();
        if (!normalizedRole.startsWith("ROLE_")) {
            normalizedRole = "ROLE_" + normalizedRole;
        }

        final String targetRole = normalizedRole;
        return allItems.stream()
                .filter(item -> item.getRoles() != null && item.getRoles().contains(targetRole))
                .collect(Collectors.toList());
    }

    private List<MenuItemResponse> createDefaultMenuItems() {
        List<MenuItemResponse> items = new ArrayList<>();

        items.add(MenuItemResponse.builder()
                .id("nav-dashboard")
                .title("Dashboard")
                .path("/dashboard")
                .icon("LayoutDashboard")
                .category("Overview")
                .order(1)
                .roles(Arrays.asList("ROLE_USER", "ROLE_ADMIN"))
                .build());

        items.add(MenuItemResponse.builder()
                .id("nav-accounts")
                .title("Accounts")
                .path("/accounts")
                .icon("Wallet")
                .category("Banking")
                .order(2)
                .roles(Arrays.asList("ROLE_USER", "ROLE_ADMIN"))
                .build());

        items.add(MenuItemResponse.builder()
                .id("nav-transfers")
                .title("Fund Transfer")
                .path("/transfers")
                .icon("ArrowLeftRight")
                .category("Banking")
                .order(3)
                .roles(Arrays.asList("ROLE_USER", "ROLE_ADMIN"))
                .build());

        items.add(MenuItemResponse.builder()
                .id("nav-transactions")
                .title("Transactions")
                .path("/transactions")
                .icon("Receipt")
                .category("Banking")
                .order(4)
                .roles(Arrays.asList("ROLE_USER", "ROLE_ADMIN"))
                .build());

        items.add(MenuItemResponse.builder()
                .id("nav-customers")
                .title("Customers")
                .path("/customers")
                .icon("Users")
                .badge("Admin")
                .category("Management")
                .order(5)
                .roles(Arrays.asList("ROLE_ADMIN"))
                .build());

        items.add(MenuItemResponse.builder()
                .id("nav-analytics")
                .title("Analytics & Reports")
                .path("/analytics")
                .icon("BarChart3")
                .badge("Pro")
                .category("Management")
                .order(6)
                .roles(Arrays.asList("ROLE_ADMIN"))
                .build());

        items.add(MenuItemResponse.builder()
                .id("nav-settings")
                .title("Settings")
                .path("/settings")
                .icon("Settings")
                .category("Account")
                .order(7)
                .roles(Arrays.asList("ROLE_USER", "ROLE_ADMIN"))
                .build());

        items.add(MenuItemResponse.builder()
                .id("nav-apidocs")
                .title("Swagger API Docs")
                .path("/swagger-ui.html")
                .icon("FileCode")
                .category("Developer")
                .order(8)
                .roles(Arrays.asList("ROLE_ADMIN"))
                .build());

        return items;
    }
}
