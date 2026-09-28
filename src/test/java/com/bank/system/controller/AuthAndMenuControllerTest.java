package com.bank.system.controller;

import com.bank.system.dto.AuthResponse;
import com.bank.system.dto.LoginRequest;
import com.bank.system.dto.RegisterRequest;
import com.bank.system.entity.AccountType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthAndMenuControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetNavbarMenuWithoutToken_ShouldReturn401() throws Exception {
        mockMvc.perform(get("/api/menu"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Authentication required")));
    }

    @Test
    public void testRegisterLoginAndGetNavbarMenuWithToken() throws Exception {
        // 1. Register a new user
        RegisterRequest registerRequest = RegisterRequest.builder()
                .name("Alice Smith")
                .username("alicesmith")
                .email("alice.smith@example.com")
                .password("securePassword123")
                .phone("+1-555-987-6543")
                .initialAccountType(AccountType.SAVINGS)
                .initialDeposit(new BigDecimal("2500.00"))
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.username", is("alicesmith")))
                .andExpect(jsonPath("$.data.accessToken", notNullValue()));

        // 2. Login with registered user credentials
        LoginRequest loginRequest = LoginRequest.builder()
                .usernameOrEmail("alicesmith")
                .password("securePassword123")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andReturn();

        String responseJson = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseJson).get("data").get("accessToken").asText();

        // 3. Access protected Menu API using Bearer Token
        mockMvc.perform(get("/api/menu")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(5))) // ROLE_USER options
                .andExpect(jsonPath("$.data[0].title", is("Dashboard")));
    }
}
