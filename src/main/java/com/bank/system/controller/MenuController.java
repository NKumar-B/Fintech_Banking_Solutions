package com.bank.system.controller;

import com.bank.system.dto.ApiResponse;
import com.bank.system.dto.MenuItemResponse;
import com.bank.system.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Navigation Menu API", description = "Endpoints to fetch dynamic navbar options for UI dashboard based on authenticated user role")
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    @Operation(
            summary = "Get navbar options menu",
            description = "Retrieves navbar options for the authenticated user. Requires Bearer token. Automatically detects user role from token unless overridden by role parameter."
    )
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getNavbarMenu(
            @RequestParam(required = false) String role
    ) {
        String effectiveRole = role;

        if (effectiveRole == null || effectiveRole.trim().isEmpty()) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getAuthorities() != null && !authentication.getAuthorities().isEmpty()) {
                effectiveRole = authentication.getAuthorities().iterator().next().getAuthority();
            }
        }

        List<MenuItemResponse> menuItems = menuService.getNavbarMenuItems(effectiveRole);
        return ResponseEntity.ok(ApiResponse.success("Navbar menu options retrieved successfully", menuItems));
    }
}
