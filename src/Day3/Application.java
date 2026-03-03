package Day3;

public class Application {
    public static void main(String[] args) {
        Student s=new Student("java","Naresh");
        Studentsaver.Studentsave(s);
        // 1. Standard entry
        Student s1 = new Student("Python", "Anjali");
        Studentsaver.Studentsave(s1);
// 2. Standard entry
        Student s2 = new Student("Spring Boot", "Rahul");
        Studentsaver.Studentsave(s2);
// 3. Entry with different casing/special characters
        Student s3 = new Student("React.js", "Siddharth");
        Studentsaver.Studentsave(s3);
// 4. Short name entry
        Student s4 = new Student("AWS", "Li");
        Studentsaver.Studentsave(s4);
// 5. Long name entry
        Student s5 = new Student("Data Structures", "Venkateshwara");
        Studentsaver.Studentsave(s5);
    }
}
