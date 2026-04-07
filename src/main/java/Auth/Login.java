package Auth;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import DataBase.copy.DBConnection;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class Login extends HttpServlet {
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String user = req.getParameter("email");
        String pass = req.getParameter("password");
        
        resp.setContentType("text/html");
        PrintWriter prt=resp.getWriter();
        
        try(Connection c=DBConnection.getConnection()){
        	
        	String query="SELECT * FROM USERS WHERE email=? and password=?";
        PreparedStatement ps=c.prepareStatement(query);
        ps.setString(1, user);
        ps.setString(2,pass);
        ResultSet res=ps.executeQuery();
        
        if(res.next()) {
        	resp.sendRedirect("Index.html");
        }
        	
        } catch (SQLException e) {
			
			e.printStackTrace();
		}
        
    }
}