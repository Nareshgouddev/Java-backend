package com.bytelog.servlets;

import java.io.*;
import java.util.*;
import com.bytelog.dao.PostDao;
import com.bytelog.utils.JsonUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

@WebServlet("/api/posts/*")
public class PostServlet extends HttpServlet {

    private final PostDao postDao = new PostDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        setCorsHeaders(resp);
        resp.setContentType("application/json");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        String pathInfo = req.getPathInfo();

        if (pathInfo == null || pathInfo.equals("/")) {
            // GET /api/posts - Get all posts
            List<Map<String, Object>> posts = postDao.getAllPosts();
            out.print(JsonUtil.listToJson(posts));
        } else {
            // GET /api/posts/{id} - Get single post
            String idStr = pathInfo.substring(1);
            try {
                int id = Integer.parseInt(idStr);
                Map<String, Object> post = postDao.getPostById(id);
                if (post != null) {
                    out.print(JsonUtil.mapToJson(post));
                } else {
                    resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.print("{\"status\":\"error\",\"message\":\"Post not found\"}");
                }
            } catch (NumberFormatException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print("{\"status\":\"error\",\"message\":\"Invalid post ID\"}");
            }
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

        BufferedReader reader = req.getReader();
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        String body = sb.toString();

        Map<String, Object> data = parseJson(body);

        String title = (String) data.get("title");
        String content = (String) data.get("content");
        String excerpt = (String) data.get("excerpt");
        String tags = data.get("tags") != null ? data.get("tags").toString() : "[]";
        String imageUrl = (String) data.get("imageUrl");
        Integer readTime = data.get("readTime") != null ? ((Number) data.get("readTime")).intValue() : 5;

        String email = (String) session.getAttribute("userEmail");
        int authorId = getUserIdByEmail(email);
        String authorName = getUserAliasByEmail(email);

        if (title == null || content == null) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Title and content are required\"}");
            return;
        }

        int postId = postDao.createPost(title, content, excerpt, authorId, authorName, tags, imageUrl, readTime);

        if (postId > 0) {
            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Post created successfully");
            response.put("id", postId);
            out.print(JsonUtil.mapToJson(response));
        } else {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"status\":\"error\",\"message\":\"Failed to create post\"}");
        }
        out.flush();
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
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
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Post ID required\"}");
            return;
        }

        String idStr = pathInfo.substring(1);
        try {
            int id = Integer.parseInt(idStr);

            BufferedReader reader = req.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            String body = sb.toString();

            Map<String, Object> data = parseJson(body);

            String title = (String) data.get("title");
            String content = (String) data.get("content");
            String excerpt = (String) data.get("excerpt");
            String tags = data.get("tags") != null ? data.get("tags").toString() : null;
            String imageUrl = (String) data.get("imageUrl");
            Integer readTime = data.get("readTime") != null ? ((Number) data.get("readTime")).intValue() : 5;

            boolean updated = postDao.updatePost(id, title, content, excerpt, tags, imageUrl, readTime);

            if (updated) {
                out.print("{\"status\":\"success\",\"message\":\"Post updated\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print("{\"status\":\"error\",\"message\":\"Post not found\"}");
            }
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Invalid post ID\"}");
        }
        out.flush();
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
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
        if (pathInfo == null || pathInfo.equals("/")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"status\":\"error\",\"message\":\"Post ID required\"}");
            return;
        }

        String idStr = pathInfo.substring(1);
        try {
            int id = Integer.parseInt(idStr);
            boolean deleted = postDao.deletePost(id);

            if (deleted) {
                out.print("{\"status\":\"success\",\"message\":\"Post deleted\"}");
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                out.print("{\"status\":\"error\",\"message\":\"Post not found\"}");
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
        resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
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
                            } catch (NumberFormatException e) {
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
