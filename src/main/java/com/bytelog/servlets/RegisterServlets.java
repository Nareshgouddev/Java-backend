package com.bytelog.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import com.bytelog.dao.UserDao;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/auth/register")
public class RegisterServlets extends HttpServlet {
	
    private UserDao userDAO = new UserDao();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        
        String alias = req.getParameter("alias");
        String email = req.getParameter("email");
        String password = req.getParameter("password");
        String role = req.getParameter("role");

        if (role == null || role.isEmpty()) {
            role = "user";
        }

        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        try {
            if (email == null || password == null || alias == null || email.isEmpty() || password.isEmpty() || alias.isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST); // 400 Bad Request
                out.print("{\"status\": \"error\", \"message\": \"All fields are required!\"}");
                return;
            }

            boolean isRegistered = userDAO.registerUser(alias, email, password, role);

            if (isRegistered) {
                out.print("{\"status\": \"success\", \"message\": \"Account created successfully!\"}");
            } else {
                // FAILURE: Usually means the email already exists in the database
                resp.setStatus(HttpServletResponse.SC_CONFLICT); // 409 Conflict
                out.print("{\"status\": \"error\", \"message\": \"Email is already registered!\"}");
            }
            
        } catch (Exception e) {
            // SERVER ERROR
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR); // 500
            out.print("{\"status\": \"error\", \"message\": \"An internal database error occurred.\"}");
            e.printStackTrace();
        } finally {
            out.flush();
            out.close();
        }
    }
}