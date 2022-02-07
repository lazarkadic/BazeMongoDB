package rs.devlabs.slozna.zgrada.data;

import java.util.HashSet;
import java.util.Set;


public class PollTransfer {

    private String question;
    private Set<String> answers = new HashSet<>();

    public PollTransfer() {
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Set<String> getAnswers() {
        return answers;
    }

    public void setAnswers(Set<String> answers) {
        this.answers = answers;
    }
}
