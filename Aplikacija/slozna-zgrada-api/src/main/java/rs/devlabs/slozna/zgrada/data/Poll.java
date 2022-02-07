package rs.devlabs.slozna.zgrada.data;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;


@Document
public class Poll implements Serializable {

    @Id
    private String id;
    private String question;
    private Map<String, Integer> answers = new HashMap<>();// answer, count
    private long created;
    private List<String> userIdList;
    @Indexed
    private String userId;

    public Poll() {
    }

    public Poll(PollTransfer transfer, String userId) {
        this.userIdList = new ArrayList<String>();
        this.id = UUID.randomUUID().toString();
        this.question = transfer.getQuestion();
        this.answers = transfer.getAnswers().stream().collect(Collectors.toMap((k) -> k, (v) -> 0));
        this.created = System.currentTimeMillis();
        this.userId = userId;
    }

    public List<String> getUserIdList() {
        return userIdList;
    }

    public void setUserIdList(List<String> userIdList) {
        this.userIdList = userIdList;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Map<String, Integer> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<String, Integer> answers) {
        this.answers = answers;
    }

    public long getCreated() {
        return created;
    }

    public void setCreated(long created) {
        this.created = created;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

}
