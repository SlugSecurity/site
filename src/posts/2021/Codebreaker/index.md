---
title: UCSC Takes 9th Place in Codebreaker 2021
date: 2021-12-09
aside:
  toc: true
tags: CBC Announcement Competition
---

Continuing the tradition of participating in the [National Security Agency's Codebreaker Challenge](https://nsa-codebreaker.org/home), UC Santa Cruz has placed 9th in the 2021 Codebreaker Challenge. This is the second year in a row that UCSC has placed in the top 10. Slug Security is proud of our team's accomplishments this year, especially of the new members who are new to cybersecurity.

### About the Challenge
The Codebreaker Challenge (CBC) is an initiative by the National Security Agency (NSA) aimed at promoting cybersecurity awareness and inspiring students to pursue careers in this field. Each challenge in the competition is a real-world cybersecurity problem. The challenges are aimed at students of all skill levels, and the competition is open to all students in the United States.

This year, the competition had over 5,400 participants from over 630 schools and ran from August 2nd to January 4th.

### This Year's Challenge
Following a fictional scenario of a lead on a potentially compromised US Defense Industrial Base (DIB) company, participants, acting as NSA analysts, collaborated with the FBI to conduct an investigation. They were tasked with analyzing network traffic, reverse engineering malware, and utilizing various tools and techniques to gather information about the attackers and their infrastructure. Their efforts were focused on determining the extent of the compromise and protecting the company from future attacks.

To start, the participants examined the network traffic of a listening post to find out which companies might have been hacked. They eventually discovered that an Online Operations and Production Services (OOPS) company, which is responsible for hosting and maintaining various containers, had been compromised. The participants were given access to the company's network logs, and by comparing several login data and IP addresses, they were able to determine the compromised account.

The OOPS company was able to obtain a copy of an employee's compromised emails after the employee reported checking emails around the time of the intrusion. Upon reviewing the emails, participants identified a suspicious email containing a disguised Powershell script that posed as a PDF. This script was used to download a larger malware that was used in the attack. Further investigation revealed that the attackers had set up a PuTTY SSH tunnel to an internal server.

The investigation of the compromised server uncovered that the attackers altered an image belonging to PANIC, which is a network security organization with a close partnership with the FBI. Due to their history of being targeted for espionage, this suggests that the attackers may be planning a supply chain attack. Further analysis of the PANIC image revealed the addition of a communication line to a listening post.

Close to solving the case, the malicious artifact reveals that a unique fingerprint was used to contact the listening post. Using reverse engineering, participants were able to identify that the fingerprint was a SHA-256 hash of a username, version, and timestamp. Using brute force, several fingerprints associated with the DIB were recovered. Using that last bit of information, participants were able to reverse engineer a connection to the attackers' command and control server, allowing them to identify all affected victims and the attacker's infrastructure.

### More Information
- [NSA Codebreaker Challenge Leaderboard 2021](https://nsa-codebreaker.org/leaderboard_2021)