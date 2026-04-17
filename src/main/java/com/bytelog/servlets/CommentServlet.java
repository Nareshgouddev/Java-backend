package com.bytelog.servlets;

import java.io.*;
import java.util.*;
import com.bytelog.dao.Commentdao;
import com.bytelog.utils.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/api/posts/*/comments")
public class CommentServlet extends HttpServlet {

    private final Commentdao commentDao = new Commentdao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.split("/").length < 3) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Post ID required\"}");
            return;
        }

        String[] parts = pathInfo.split("/");
        try {
            int postId = Integer.parseInt(parts[1]);
            List<Map<String, Object>> comments = commentDao.getCommentsByPost(postId);
            out.print(JsonUtil.listToJson(comments));
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Invalid post ID\"}");
        }
        out.flush();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        HttpSession session = req.getSession(false);
        if (session == null || session.getAttribute("userEmail") == null) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.print("{\"status\":\"error\",\"message\":\"Unauthorized\"}");
            return;
        }

        String pathInfo = req.getPathInfo();
        if (pathInfo == null || pathInfo.split("/").length < 3) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Post ID required\"}");
            return;
        }

        String[] parts = pathInfo.split("/");
        try {
            int postId = Integer.parseInt(parts[1]);

            BufferedReader reader = req.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            String body = sb.toString();

            Map<String, Object> data = parseJson(body);
            String content = (String) data.get("content");

            if (content == null || content.trim().isEmpty()) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"status\":\"error\",\"message\":\"Comment content is required\"}");
                return;
            }

            String email = (String) session.getAttribute("userEmail");
            int userId = getUserIdByEmail(email);
            String userAlias = getUserAliasByEmail(email);

            int commentId = commentDao.addComment(postId, userId, userAlias, content);

            if (commentId > 0) {
                Map<String, Object> response = new HashMap<>();
                response.put("status", "success");
                response.put("message", "Comment added");
                response.put("id", commentId);
                out.print(JsonUtil.mapToJson(response));
            } else {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.print("{\"status\":\"error\",\"message\":\"Failed to add comment\"}");
            }
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Invalid post ID\"}");
        }
        out.flush();
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCorsHeaders(HttpServletResponse resp) {
        resp.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
        resp.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        resp.setHeader("Access-Control-Allow-Credentials", "true");
    }

    private Map<String, Object> parseJson(String body) {
        Map<String, Object> result = new HashMap<>();
        if (body == null || body.isEmpty()) return result;

        body = body.trim();
        if (body.startsWith("{") && body.endsWith("}")) {
            body = body.substring(1, body.length() - 1);
        }

        int i = 0;
        while (i < body.length()) {
            if (body.charAt(i) == ',' || body.charAt(i) == ':') {
                i++;
                continue;
            }
            if (body.charAt(i) == '"') {
                int end = findEndQuote(body, i + 1);
                String key = body.substring(i + 1, end);
                i = end + 1;

                while (i < body.length() && (body.charAt(i) == ':' || body.charAt(i) == ' ')) i++;

                if (i < body.length()) {
                    char c = body.charAt(i);
                    if (c == '"') {
                        int vend = findEndQuote(body, i + 1);
                        result.put(key, body.substring(i + 1, vend));
                        i = vend + 1;
                    } else if (c == '{' || c == '[') {
                        int endBracket = findMatchingBracket(body, i);
                        String nested = body.substring(i, endBracket + 1);
                        result.put(key, nested);
                        i = endBracket + 1;
                    } else if (c == 't' || c == 'f') {
                        boolean boolVal = body.substring(i).startsWith("true");
                        result.put(key, boolVal);
                        i += boolVal ? 4 : 5;
                    } else if (c == 'n') {
                        result.put(key, null);
                        i += 4;
                    } else {
                        int endNum = i;
                        while (endNum < body.length() && !",}".contains(String.valueOf(body.charAt(endNum)))) {
                            endNum++;
                        }
                        String numStr = body.substring(i, endNum).trim();
                        if (numStr.contains(".")) {
                            result.put(key, Double.parseDouble(numStr));
                        } else {
                            try {
                                result.put(key, Integer.parseInt(numStr));
                            } catch (NumberFormatException ex) {
                                result.put(key, numStr);
                            }
                        }
                        i = endNum;
                    }
                }
            } else {
                i++;
            }
        }
        return result;
    }

    private int findEndQuote(String s, int start) {
        while (start < s.length()) {
            if (s.charAt(start) == '"' && (start == 0 || s.charAt(start - 1) != '\\')) {
                return start;
            }
            start++;
        }
        return s.length() - 1;
    }

    private int findMatchingBracket(String s, int start) {
        char open = s.charAt(start);
        char close = open == '{' ? '}' : ']';
        int count = 1;
        int i = start + 1;
        while (i < s.length() && count > 0) {
            if (s.charAt(i) == open) count++;
            else if (s.charAt(i) == close) count--;
            i++;
        }
        return i - 1;
    }

    private int getUserIdByEmail(String email) {
        try {
            java.sql.Connection c = DataBase.copy.DBConnection.getConnection();
            java.sql.PreparedStatement ps = c.prepareStatement("SELECT id FROM users WHERE email = ?");
            ps.setString(1, email);
            java.sql.ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                int id = rs.getInt("id");
                rs.close();
                ps.close();
                c.close();
                return id;
            }
            rs.close();
            ps.close();
            c.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    private String getUserAliasByEmail(String email) {
        try {
            java.sql.Connection c = DataBase.copy.DBConnection.getConnection();
            java.sql.PreparedStatement ps = c.prepareStatement("SELECT alias FROM users WHERE email = ?");
            ps.setString(1, email);
            java.sql.ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                String alias = rs.getString("alias");
                rs.close();
                ps.close();
                c.close();
                return alias;
            }
            rs.close();
            ps.close();
            c.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Unknown";
    }
}