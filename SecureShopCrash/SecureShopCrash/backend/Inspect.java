import org.springframework.ai.chat.client.ChatClient;
import java.lang.reflect.Method;

public class Inspect {
    public static void main(String[] args) throws Exception {
        System.out.println("Methods in ChatClientRequestSpec:");
        for (Method m : ChatClient.ChatClientRequestSpec.class.getMethods()) {
            System.out.print(m.getName() + "(");
            Class<?>[] params = m.getParameterTypes();
            for (int i=0; i<params.length; i++) {
                System.out.print(params[i].getSimpleName() + (i<params.length-1 ? ", " : ""));
            }
            System.out.println(")");
        }
    }
}
