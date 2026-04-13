package com.bytelog.filters;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CorsFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Initialization code, if needed
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain)
            throws IOException, ServletException {
        
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        // 1. Allow your React app's URL (Update 5173 if Vite uses a different port)
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        
        // 2. Allow standard HTTP methods
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        
        // 3. Allow standard headers like Content-Type
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        
        // 4. Allow credentials (cookies/sessions) to be passed
        response.setHeader("Access-Control-Allow-Credentials", "true");

        // 5. Handle "Preflight" requests (React sends an OPTIONS request before a POST)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // Pass the request along the chain to your Login or Register Servlets
        filterChain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Cleanup code, if needed
    }
}