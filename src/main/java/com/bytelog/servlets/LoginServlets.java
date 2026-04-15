package com.bytelog.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import DataBase.copy.DBConnection;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/auth/login")
public class LoginServlets extends HttpServlet {
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    	
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");

        String email = req.getParameter("email");
        String pass  = req.getParameter("password");
        PrintWriter prt = resp.getWriter();

        try (Connection c = DBConnection.getConnection()) {

            String query = "SELECT * FROM USERS WHERE email=? AND password=?";
            PreparedStatement ps = c.prepareStatement(query);
            ps.setString(1, email);
            ps.setString(2, pass);
            ResultSet res = ps.executeQuery();

            if (res.next()) {
                HttpSession session = req.getSession();
                session.setAttribute("userEmail", email);


                String userName = res.getString("alias"); 
                String role     = res.getString("role");  
                int userId      = res.getInt("id");

                prt.print("{\"status\":\"success\",\"message\":\"Login successful\","
                        + "\"userName\":\"" + userName + "\","
                        + "\"role\":\"" + role + "\","
                        + "\"userId\":" + userId + "}");
            } else {
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                prt.print("{\"status\":\"error\",\"message\":\"Invalid Email or Password!\"}");
            }
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            prt.print("{\"status\":\"error\",\"message\":\"Database error occurred\"}");
            e.printStackTrace();
        }
        prt.flush();
    }
}