package mahametro.tripchart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import mahametro.tripchart.entity.Issues;
@Repository
public interface IssueRepo extends JpaRepository<Issues, Integer> {

}
