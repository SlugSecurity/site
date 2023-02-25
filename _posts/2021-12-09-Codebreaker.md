---
title: UCSC Takes 9th Place in Codebreaker 2021
aside:
  toc: true
tags: CBC Announcement Competition
---

Continuing the tradition of participating in the [National Security Agency's Codebreaker Challenge](https://nsa-codebreaker.org/home), UCSC has placed 9th in the 2021 Codebreaker Challenge. This is the second year in a row that UCSC has placed in the top 10. We are proud to represent UCSC in this competition.

### About the Codebreaker Challenge
The National Security Agency (NSA) hosts the Codebreaker Challenge (CBC) for students in order to raise cybersecurity awareness and encourage students to pursue careers in cybersecurity. Each challenge in the competition is a real-world cybersecurity problem. The challenges are aimed at students of all skill levels, and the competition is open to all students in the United States.

This year, the competition had over 5,400 participants from over 630 schools and ran from August 2nd to January 4th.

### This Year's Challenge
Following a lead on a potentially compromised US Defense Industrial Base (DIB) company, participants, acting as NSA analysts, worked with the FBI to uncover details about the malware, the attackers, and their infrastructure. The challenge is broken down into several tasks, each of which involves analyzing network traffic, reverse engineering malware, and using various tools and techniques to extract information.

At first, participants analyzed the network traffic of a listening post to determine which companies were potentially compromised. Identifying the compromised company, an Online Operations and Production Services (OOPS) company, which is important for hosting and maintaining various containers, participants were provided network logs from the company's network. Cross-referencing several login data and IP addresses, participants were able to identify the compromised account.

Next, the OOPS company was able to provide a copy of the compromised employee's emails given a statement from the employee claiming they would have been checking emails around the time of the intrusion. Checking the emails, participants were able to identify a suspicious email that contained a Powershell script that was disguised as a PDF. The script was used as a downloader for the larger malware that was used in the attack. Investigating, this malware further revealed the attackers set up a PuTTY SSH tunnel to an internal server.

During the investigation of the compromised server, it is revealed that the attackers modified an image that was owned by PANIC, the Prevention of Adversarial Network Intrusions Conglomerate. Because PANIC has a close partnership with the FBI, they have been a long target of espionage, this indicates that the attackers may be aiming towards a supply chain attack. Investigating the recent changes in the PANIC image, participants were able to identify the addition of a communication line to a listening post.

Close to solving the case, the malicious artifact reveals that a unique fingerprint was used to contact the listening post. Using reverse engineering, participants were able to identify that the fingerprint was a SHA-256 hash of a username, version, and timestamp. Using brute force, several fingerprints associated with the DIB were recovered. Using that last bit of information, participants were able to reverse engineer a connection to the attackers' command and control server, allowing them to identify all affected victims and the attacker's infrastructure.

### More Information
- [NSA Codebreaker Challenge Leaderboard 2021](https://nsa-codebreaker.org/leaderboard_2021)