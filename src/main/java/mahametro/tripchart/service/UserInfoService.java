package mahametro.tripchart.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import mahametro.tripchart.entity.UserInfo;
import mahametro.tripchart.repository.UserInfoRepository;


@Service
public class UserInfoService {
	
	@Autowired
	private UserInfoRepository userRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	public String addUser(UserInfo userInfo) {
		userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));
		userRepo.save(userInfo);
		return "User Added to System Sucessfully";
	}

}
