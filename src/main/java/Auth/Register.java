package Auth;

import javax.sql.*;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import java.io.*;

public class Register extends HttpServlet{
	protected void doPost(HttpServletRequest req,HttpServletResponse res)throws IOException,ServletException {
		String user=req.getParameter("user");
		String email=req.getParameter("email");
		String pass=req.getParameter("pass");
		
		PrintWriter p=res.getWriter();
		p.print(user);
		p.print(email);
		System.out.println(user+""+email+""+pass);
		
	}
	
	
}
