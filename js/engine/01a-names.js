/* ===================== NAMES: cultures, surnames, families ===================== */
// A person's names come from one naming culture: first name and surname belong together, and the surname follows that
// culture's own rules (two surnames, particles, a father's name, a feminine form). The old shared lists stay as the
// "cosmopolitan" culture, the invented names of the Hunter world; about one person in five comes from it.
// Every person keeps: first, last (the surname as written), surK (the family it belongs to) and cul (the culture).
const NC_S = s => s.split(/\s+/).filter(Boolean).map(x => x.replace(/_/g, ' '));
const NAME_CULTURES = {
  jp: {w: 4, M: NC_S('Haruki Ren Sota Yuto Kaito Daiki Shun Takumi Ryota Kenji Hiroshi Masato Tetsuya Shinji Kazuki Yusuke Naoki Ryusei Akihiro Koji Tatsuya Hayato Itsuki Minato Riku Asahi Kosuke Junpei Genji Isamu Noboru Takeru'),
    F: NC_S('Hana Yui Mio Sakura Rin Aoi Mei Hinata Kaede Natsuki Ayaka Misaki Chihiro Haruka Nanami Emiko Keiko Michiko Sayuri Tomoe Akane Fumiko Ritsuko Yoshiko Kiyomi Shizuka Umeko Momoka Tsubaki Kanon Suzu Wakana'),
    L: NC_S('Sato Suzuki Takahashi Tanaka Watanabe Ito Yamamoto Kobayashi Kato Yoshida Yamada Sasaki Matsumoto Inoue Kimura Hayashi Shimizu Yamazaki Mori Ikeda Hashimoto Ishikawa Ogawa Fujita Okada Goto Hasegawa Murakami Kondo Ishii Sakamoto Endo Aoki Fujii Nishimura Fukuda Ota Miura Okamoto Matsuda Nakajima Harada Ono Tamura Takeda Ueda Morita Hara Shibata Sakai Kudo Yokoyama Miyazaki Uchida Takagi Ando Taniguchi Ohno Maruyama Imai Kono Kubo Sugiyama Masuda Hirano Otsuka Chiba Kuno Amano Arakawa Sugawara')},
  cn: {w: 4, M: NC_S('Wei Jun Hao Ming Lei Tao Bo Yang Chen Jian Feng Zhi Kai Long Peng Qiang Rui Xiang Yi Zihan Haoran Yuxuan Jiahao Junjie Zhiwei Tianyu Wenbo Shengli Guang Heng Liang Shan'),
    F: NC_S('Mei Li Xiu Ying Hua Jing Lan Ning Yan Xin Yue Zhen Qing Fang Hui Ling Ruoxi Yutong Xinyi Shiyu Jiayi Yuxi Wanting Meiling Xiaoyu Huiling Yating Lihua Qiuyue Chunhua Shuang Lian'),
    L: NC_S('Wang Li Zhang Liu Chen Yang Huang Zhao Wu Zhou Xu Sun Ma Zhu Hu Guo He Lin Gao Luo Zheng Liang Xie Song Tang Han Feng Deng Cao Peng Zeng Xiao Tian Dong Pan Yuan Cai Jiang Yu Du Ye Cheng Wei Su Lu Ding Ren Shen Yao Jin Fu Fan Lei Bai Qin Kong Shi Mo Zhong Gu Hou Xia Long Qiao')},
  kr: {w: 3, M: NC_S('Minjun Seojun Dohyun Jiho Junwoo Hyunwoo Jaewon Taeyang Sungmin Donghyun Joonho Seungwoo Kyungsoo Jinwoo Hyunsik Myungsoo Daesung Wonho Sanghoon Youngjae Jaehyun Kangdae Inho Byungchul Chanwoo'),
    F: NC_S('Seoyeon Jiwoo Haeun Soyeon Minji Yuna Eunji Jiyoung Hyejin Sumin Dahye Yerin Chaewon Nayeon Jisoo Hyunjoo Mirae Bora Sora Eunbi Hana Yejin Seulgi Dayeon Jieun'),
    L: NC_S('Kim Lee Park Choi Jung Kang Cho Yoon Jang Lim Han Oh Seo Shin Kwon Hwang Ahn Song Yoo Hong Jeon Ko Moon Yang Son Bae Baek Heo Nam Shim Noh Ha Kwak Sung Cha Joo Woo Ryu Min Jin Na Ji Byun Chae Do Uhm Gil Pyo')},
  vn: {w: 2, M: NC_S('Anh Bao Cuong Dung Duc Hai Hieu Hoang Huy Khanh Khoa Long Minh Nam Phong Quang Son Tai Thanh Thinh Tuan Vinh Viet Trung Dat'),
    F: NC_S('An Chi Dao Giang Ha Hoa Huong Lan Linh Mai My Ngoc Nhung Phuong Quynh Thao Thu Trang Tuyet Uyen Van Vy Yen Xuan Hang'),
    L: NC_S('Nguyen Tran Le Pham Hoang Huynh Phan Vu Vo Dang Bui Do Ho Ngo Duong Ly Truong Dinh Lam Mai Trinh Cao Luong Ha Quach Ta Chau Thai Kieu Doan')},
  th: {w: 2, M: NC_S('Somchai Anan Kittisak Prasert Chaiyaphum Thanawat Nattapong Wichai Surasak Pongsak Arthit Kriangkrai Sakda Tawan Niran Phichit Chatchai Weerapong'),
    F: NC_S('Siriporn Malee Kanya Ploy Nok Chanida Rattana Supaporn Wanida Arunee Kesinee Lalita Nittaya Pimchanok Sasithorn Ubon Duangjai Kulap'),
    L: NC_S('Saetang Wongsakul Srisuk Thongchai Chaiyasit Rattanakorn Phongphan Boonmee Kittikhun Suwannarat Jaidee Sombat Chalermchai Prasertsak Wattana Siriwan Thammasat Nakprasit Charoensuk Panyawong Rungrueang Siamwalla Tanakit')},
  ms: {w: 2, M: NC_S('Arif Budi Dimas Eko Fajar Hendra Irfan Joko Rizal Surya Taufik Wahyu Adi Bagus Rangga Hafiz Iskandar Haziq Amir Syafiq Kurniawan Yusuf'),
    F: NC_S('Ayu Dewi Indah Kartika Lestari Mega Nurul Putri Ratna Sari Sinta Wulan Intan Melati Kirana Aisyah Farah Nadia Siti Zahra Laila Puspita'),
    L: NC_S('Santoso Wijaya Hidayat Saputra Kusuma Pratama Setiawan Gunawan Halim Nugroho Siregar Lubis Harahap Simanjuntak Tanjung Rahman Ismail Ibrahim Abdullah Hamzah Osman Yaakob Latif Mahmud Sulaiman')},
  ph: {w: 2, M: NC_S('Jose Ramon Paolo Miguel Jericho Rafael Dante Andres Emilio Lorenzo Carlo Joaquin Ramil Arnel Bayani Datu Makisig Lakan'),
    F: NC_S('Maria Ligaya Mayumi Tala Dalisay Marisol Rosario Imelda Corazon Lourdes Divina Analyn Jasmin Liwayway Amihan Diwata Hiraya Luningning'),
    L: NC_S('Santos Reyes Cruz Bautista Ocampo Garcia Mendoza Torres Villanueva Ramos Aquino Dizon Castillo Manalo Pascual Mercado Soriano Lacson Macaraeg Dimaculangan Magsaysay Tolentino Salonga Agbayani Panganiban')},
  in: {w: 4, M: NC_S('Arjun Rohan Vikram Aarav Kabir Ishaan Dev Aditya Rahul Sanjay Pranav Nikhil Varun Siddharth Karthik Rajesh Anand Vijay Suresh Harsh Mihir Tejas Rudra Omkar Kunal Ravi Ashwin Gautam Lakshman Naveen'),
    F: NC_S('Priya Ananya Kavya Diya Meera Isha Riya Aditi Lakshmi Sita Radha Nandini Pooja Shreya Tanvi Deepa Revathi Sunita Asha Jaya Kamala Uma Ira Leela Malini Neha Saanvi Tara Vani Anjali'),
    L: NC_S('Sharma Verma Patel Iyer Nair Reddy Rao Gupta Mehta Joshi Kapoor Malhotra Chopra Banerjee Chatterjee Mukherjee Das Bose Sen Pillai Menon Kulkarni Deshpande Pandey Mishra Tiwari Agarwal Bhatt Desai Shah Singh Gill Sandhu Krishnan Subramanian Venkatesh Naidu Choudhury Thakur Saxena')},
  fa: {w: 2, M: NC_S('Dariush Kourosh Arash Babak Farhad Kaveh Siavash Behrouz Kamran Navid Omid Payam Reza Shahin Bijan Rostam Ardeshir Jamshid Mehran Sohrab'),
    F: NC_S('Shirin Parisa Leila Nasrin Roxana Golnar Mina Shadi Azadeh Laleh Mahsa Niloufar Sima Taraneh Yasmin Farah Ziba Soraya Pari Atefeh'),
    L: NC_S('Tehrani Shirazi Esfahani Hosseini Ahmadi Karimi Rahimi Jafari Moradi Rostami Nazari Sadeghi Farahani Kazemi Bahrami Zand Afshar Golzar Tabrizi Mirzaei Ebrahimi Najafi Parvizi Dehghan Sharifi')},
  ar: {w: 4, M: NC_S('Omar Karim Tariq Zayd Hamza Yusuf Khalid Samir Nabil Faisal Rashid Ziad Jamal Malik Idris Bilal Hassan Ibrahim Walid Anwar Sami Adel Fadi Rami Hadi Nizar Marwan Tamer'),
    F: NC_S('Layla Amira Nour Yasmin Salma Rania Lina Mariam Dalia Hala Huda Samira Zaynab Farida Jamila Leen Rasha Dana Maha Reem Hiba Nadia Ghada Sana Asma Lubna Noura Widad'),
    L: NC_S('al-Rashid al-Amin al-Hashimi al-Masri al-Tamimi al-Najjar al-Farsi al-Khatib al-Sayed al-Qasimi Haddad Nasser Khoury Mansour Saleh Barakat Saad Haidar Darwish Habib Azar Shalhoub Halabi Bitar Sabbagh Mubarak Aziz Hamdan Jaber Kanaan Othman Qureshi Yassin Zaher Aoun Tawil')},
  tr: {w: 2, M: NC_S('Emre Kerem Burak Mert Can Deniz Cem Onur Serkan Baris Kaan Tolga Yusuf Arda Efe Hakan Murat Selim Orhan Ilker'),
    F: NC_S('Elif Zeynep Ayse Defne Ece Selin Melis Asli Derya Ebru Gizem Pinar Sena Yasemin Nazli Tugba Damla Esra Irem Sibel'),
    L: NC_S('Yilmaz Kaya Demir Celik Sahin Yildiz Yildirim Ozturk Aydin Ozdemir Arslan Dogan Kilic Aslan Cetin Kara Koc Kurt Ozkan Simsek Polat Erdem Korkmaz Tekin Aksoy Uysal Bulut Gunes Karaca Duman')},
  he: {w: 1, M: NC_S('Ariel Eitan Noam Yonatan Ido Itai Amit Lior Omer Gal Yair Ronen Asaf Boaz Elad Nadav'),
    F: NC_S('Noa Tamar Shira Yael Maya Hila Michal Talia Adi Rivka Orly Dafna Liat Ayelet Inbal Neta'),
    L: NC_S('Cohen Levi Mizrahi Peretz Biton Dahan Avraham Friedman Katz Azoulay Ben-David Shapiro Ben-Ami Halevi Rosen Golan Barak Navon Segal Weiss')},
  // Ethiopian and Eritrean: the second name is the father's first name
  et: {w: 2, M: NC_S('Abebe Dawit Haile Mekonnen Tesfaye Yohannes Solomon Kebede Girma Bekele Getachew Tadesse Alemayehu Berhanu Desta Fikru Gebre Mulugeta Negash Tewodros Yared Zerihun'),
    F: NC_S('Almaz Selam Tigist Hirut Meron Bethlehem Saba Mekdes Liya Hana Rahel Tsion Yeshi Aster Genet Kidist Marta Senait Tsehay Wubit Eden Feven'),
    pat: 'father'},
  wa: {w: 4, M: NC_S('Kwame Kofi Kojo Yaw Chidi Emeka Obinna Tunde Femi Ade Babajide Olusegun Chinedu Ikenna Nnamdi Kayode Seun Sekou Mamadou Ousmane Moussa Abdoulaye Amadou Boubacar Idrissa Cheikh Kwesi Ekow Jide Uche'),
    F: NC_S('Ama Akosua Abena Efua Adwoa Ngozi Chiamaka Adaeze Ifeoma Nkechi Folake Funmilayo Yetunde Bisola Temitope Aminata Fatoumata Mariama Aissatou Kadiatou Oumou Awa Ndeye Esi Yaa Zainab Adaora Chioma Obiageli Kemi'),
    L: NC_S('Mensah Owusu Boateng Asante Osei Agyeman Appiah Darko Adjei Nkrumah Okafor Okonkwo Eze Nwosu Obi Adeyemi Adebayo Ogunleye Balogun Bakare Oyelaran Afolabi Diallo Traore Keita Coulibaly Diop Ndiaye Sow Ba Camara Toure Sylla Kone Sankara Ouedraogo Achebe Okeke Nnaji Ekwueme Danjuma Bello')},
  ea: {w: 3, M: NC_S('Jabari Baraka Juma Hamisi Kamau Kariuki Otieno Omondi Mwangi Tendai Tafadzwa Farai Thabo Sipho Themba Mandla Lwazi Bongani Kagiso Tshepo Neo Lesedi Mpho Sizwe Zola Musa Amani Simba Jelani Bakari'),
    F: NC_S('Amani Imani Zawadi Neema Wanjiru Njeri Akinyi Atieno Nyokabi Wambui Rudo Chipo Nyasha Tatenda Thandiwe Nomvula Zanele Lindiwe Nandi Palesa Lerato Naledi Busisiwe Ayanda Sibongile Makena Zuri Pendo Furaha Halima'),
    L: NC_S('Kamau Mwangi Otieno Odhiambo Wanjala Kipchoge Kiplagat Rotich Cheruiyot Mutua Njoroge Kimani Moyo Ncube Dube Sibanda Mlambo Chikwanha Mutasa Dlamini Nkosi Khumalo Zulu Ndlovu Mthembu Mokoena Molefe Mahlangu Mabaso Banda Phiri Mwale Tembo Lungu Haji Mwinyi Salim Kombo')},
  // Spanish-speaking: two surnames, father's first then mother's; the family goes by the first
  es: {w: 4, M: NC_S('Alejandro Diego Javier Mateo Santiago Sebastián Andrés Emilio Gonzalo Ignacio Joaquín Julián Lorenzo Marcos Nicolás Pablo Rodrigo Tomás Esteban Hernán Fermín Iker Álvaro Benicio Cristóbal Gael Leandro Maximiliano Octavio Rubén'),
    F: NC_S('Lucía Sofía Valentina Camila Isabella Martina Ximena Paloma Inés Carmen Pilar Rocío Alba Nerea Itziar Elena Julieta Florencia Renata Constanza Guadalupe Mercedes Dolores Amparo Begoña Montserrat Soledad Esperanza Catalina Marisol'),
    L: NC_S('García Rodríguez Martínez López González Hernández Pérez Sánchez Ramírez Torres Flores Rivera Gómez Díaz Morales Ortiz Gutiérrez Chávez Ramos Ruiz Álvarez Mendoza Castillo Jiménez Moreno Romero Herrera Medina Aguilar Vargas Castro Guzmán Muñoz Rojas Navarro Domínguez Salazar Vega Cabrera Fuentes Ibarra Echeverría Arrieta Goikoetxea Zubizarreta Villalobos Montenegro Sandoval Cordero Paredes Quiroga Valdivia Bustamante Iturbide Saavedra Arancibia Peñaloza'),
    two: 0.85, key: 'first'},
  // Portuguese-speaking: often two surnames, mother's then father's; the family goes by the last
  pt: {w: 3, M: NC_S('João Pedro Tiago Rafael Gonçalo Duarte Rodrigo Martim Afonso Vasco Bernardo Henrique Thiago Gustavo Caio Leonardo Vinícius Otávio Renato Fábio Rui Nuno Sérgio Teodoro Bento Júlio Davi Heitor Matheus Lucas'),
    F: NC_S('Ana Beatriz Mariana Inês Leonor Carolina Matilde Raquel Joana Teresa Rita Luana Larissa Fernanda Gabriela Juliana Letícia Thaís Bruna Vitória Helena Clara Madalena Graça Conceição Iara Jussara Lívia Rosana Benedita'),
    L: NC_S('Silva Santos Ferreira Pereira Oliveira Costa Rodrigues Martins Jesus Sousa Fernandes Gonçalves Gomes Lopes Marques Alves Almeida Ribeiro Pinto Carvalho Teixeira Moreira Correia Mendes Nunes Soares Vieira Monteiro Cardoso Rocha Neves Coelho Cruz Cunha Pires Ramos Reis Simões Antunes Matos Fonseca Machado Araújo Barbosa Tavares Quintela Albuquerque Magalhães Brandão Figueiredo Sampaio Valadares Junqueira Bragança'),
    two: 0.65, key: 'last'},
  it: {w: 3, M: NC_S('Lorenzo Matteo Leonardo Alessandro Gabriele Riccardo Tommaso Edoardo Giacomo Niccolò Pietro Federico Davide Emanuele Simone Stefano Vittorio Raffaele Salvatore Giuseppe Carmine Ottavio Fabrizio Massimo Dario Rocco Enzo Aurelio'),
    F: NC_S('Giulia Sofia Aurora Alice Ginevra Beatrice Chiara Francesca Martina Arianna Ludovica Vittoria Bianca Camilla Elisa Federica Gaia Lucrezia Serena Valeria Rosalia Carmela Ornella Fiorella Graziella Assunta Livia Margherita'),
    L: NC_S("Rossi Bianchi Esposito Romano Colombo Ricci Marino Greco Bruno Gallo Conti De_Luca Mancini Giordano Rizzo Lombardi Moretti Barbieri Fontana Santoro Mariani Rinaldi Caruso Ferrara Galli Martini Leone Longo Gentile Di_Stefano Lo_Russo D'Angelo Vitale Serra Coppola De_Santis Marchetti Parisi Villa Ferri Fabbri Palumbo Benedetti Sorrentino Monti Cattaneo Bellini D'Amico Pellegrini Lo_Bianco Di_Marco")},
  fr: {w: 3, M: NC_S('Louis Gabriel Raphaël Arthur Hugo Jules Théo Léon Antoine Mathis Baptiste Clément Étienne Gaspard Lucien Maxime Olivier Rémi Sylvain Thibault Yves Aurélien Benoît Cyprien Florian Grégoire Jean-Luc Pierre-Alain Marius Valentin'),
    F: NC_S('Louise Emma Jade Chloé Léa Manon Camille Inès Juliette Adèle Margaux Clémence Élodie Océane Solène Amélie Bérénice Colette Delphine Gaëlle Hélène Isaure Mathilde Noémie Sidonie Vivienne Anne-Sophie Marie-Claire Ombeline Sylvie'),
    L: NC_S('Dubois Lefèvre Moreau Girard Fontaine Rousseau Leclerc Chevalier Dupont Marchand Laurent Beaumont Lemaire Fournier Bonnet Mercier Faure Gauthier Perrin Morel Roussel Blanchard Guérin Brunet Vasseur Martel Lacroix Deschamps Garnier Renaud Boucher Picard Lambert Dumas de_la_Croix Le_Gall Le_Roux du_Pré de_Villiers de_Montfort Le_Goff Delacroix Lemoine Courtois Valois Bellamy Clément Toussaint Aubert Carpentier')},
  nl: {w: 2, M: NC_S('Daan Sem Lucas Milan Bram Thijs Joris Jesse Ruben Stijn Wouter Pieter Maarten Jasper Lars Floris Sander Bart Koen Jeroen Arne Wout Senne Jelle'),
    F: NC_S('Emma Julia Sanne Lotte Fleur Femke Anouk Lieke Isa Noor Roos Sofie Marieke Annelies Eline Ilse Jet Merel Nienke Saskia Lien Elien Margot Wies'),
    L: NC_S('van_der_Berg de_Vries van_Dijk Bakker Visser de_Jong van_Leeuwen Smit van_den_Bosch Mulder de_Graaf Verhoeven van_Rijn Hendriks Kuipers van_Beek de_Wit Peeters Janssens Maes Claes Wouters van_Damme De_Smet Vermeulen van_der_Meer Dekker Brouwer de_Boer van_Wijk Hoekstra van_der_Linden Jacobs Willems Goossens van_Aken de_Bruijn Schouten Timmermans van_Houten')},
  de: {w: 2, M: NC_S('Lukas Felix Maximilian Jonas Leon Paul Elias Moritz Jakob Niklas Florian Tobias Johannes Matthias Konrad Friedrich Gregor Ulrich Volker Wolfgang Heinrich Bastian Kaspar Till Anton'),
    F: NC_S('Lena Hannah Mia Lea Clara Marie Charlotte Greta Frieda Johanna Katharina Sophie Annika Ingrid Gisela Liesl Mathilda Wiebke Ute Heike Brigitte Elke Rosalind Antje Henrike'),
    L: NC_S('Müller Schmidt Schneider Fischer Weber Meyer Wagner Becker Schulz Hoffmann Koch Richter Bauer Klein Wolf Schröder Neumann Schwarz Zimmermann Braun Krüger Hartmann Lange Werner Krause Lehmann Köhler Herrmann König Walter Kaiser Fuchs Vogel Engel Brandt von_Hohenberg von_Falkenrath von_Eschenbach Lindemann Ackermann')},
  nr: {w: 2, M: NC_S('Erik Lars Magnus Anders Nils Henrik Sven Johan Leif Olav Bjørn Torsten Gustav Axel Viggo Rasmus Mikkel Espen Kjell Ragnar Halvard Sindre Ivar Ture'),
    F: NC_S('Astrid Ingrid Sigrid Freja Linnea Maja Elin Saga Liv Hedda Ylva Solveig Ragnhild Tove Kristin Karin Annika Sanna Elsa Signe Malin Siri Embla Tuva'),
    L: NC_S('Andersson Johansson Karlsson Nilsson Eriksson Larsson Olsson Persson Svensson Gustafsson Lindberg Lindström Bergström Sundqvist Ekström Holm Dahl Berg Nyberg Lund Hansen Johansen Olsen Larsen Andersen Pedersen Nielsen Jensen Kristiansen Haugen Bakken Solberg Strand Halvorsen Nygaard Lindahl Sandvik Aasen')},
  // Icelandic: the surname is made from a parent's first name, "-son" or "-dóttir" (or "-bur")
  is: {w: 1, M: NC_S('Jón Einar Gunnar Sigurður Ólafur Magnús Bjarni Helgi Pétur Hálfdan Kári Ari Þór Snorri Egill Hrafn Gísli Haukur Ragnar Steinn'),
    F: NC_S('Guðrún Sigrún Anna Kristín Helga Katrín Sólveig Hildur Ásta Björk Eydís Freyja Halla Inga Lilja Rakel Sunna Þóra Unnur Vigdís'),
    gen: {Jón: 'Jóns', Einar: 'Einars', Gunnar: 'Gunnars', Sigurður: 'Sigurðar', Ólafur: 'Ólafs', Magnús: 'Magnús', Bjarni: 'Bjarna', Helgi: 'Helga', Pétur: 'Péturs', Hálfdan: 'Hálfdanar', Kári: 'Kára', Ari: 'Ara', Þór: 'Þórs', Snorri: 'Snorra', Egill: 'Egils', Hrafn: 'Hrafns', Gísli: 'Gísla', Haukur: 'Hauks', Ragnar: 'Ragnars', Steinn: 'Steins',
      Guðrún: 'Guðrúnar', Sigrún: 'Sigrúnar', Anna: 'Önnu', Kristín: 'Kristínar', Helga: 'Helgu', Katrín: 'Katrínar', Sólveig: 'Sólveigar', Hildur: 'Hildar'},
    pat: 'is'},
  // Slavic: the feminine form of a surname differs (Ivanov → Ivanova, Kowalski → Kowalska, Novák → Nováková)
  sl: {w: 4, M: NC_S('Ivan Dmitri Alexei Mikhail Nikolai Sergei Pavel Yaroslav Bogdan Milan Luka Marek Tomasz Piotr Jakub Wojciech Lukáš Ondřej Vojtěch Matej Stanislav Radomir Dragan Zoran Vuk Miroslav Taras Oleksandr Borislav Vladan'),
    F: NC_S('Anastasia Ekaterina Natalia Olga Tatiana Yelena Irina Ksenia Darya Milena Zofia Agnieszka Katarzyna Magdalena Małgorzata Tereza Veronika Kateřina Ludmila Jana Dragana Jelena Milica Vesna Bojana Oksana Olena Halyna Zlata Radka'),
    L: NC_S('Ivanov Petrov Smirnov Volkov Sokolov Morozov Lebedev Kozlov Novikov Orlov Pavlov Belov Zaitsev Karpov Fedorov Kuznetsov Vinogradov Golubev Ilyin Borodin Kowalski Wiśniewski Lewandowski Zieliński Kamiński Wójcik Kowalczyk Mazur Jankowski Nowicki Dąbrowski Kozłowski Novák Dvořák Procházka Svoboda Černý Horák Veselý Marek Jovanović Petrović Nikolić Marković Đorđević Stojanović Horvat Kovačević Babić Shevchenko Bondarenko Kovalenko Tkachenko Melnyk Kravchuk Polishchuk Dimitrov Georgiev Todorov'),
    fem: 'sl'},
  gr: {w: 2, M: NC_S('Nikos Giorgos Dimitris Yannis Kostas Christos Panagiotis Vasilis Stavros Thanos Andreas Michalis Spyros Alexandros Lefteris Petros Manolis Stelios Achilleas Odysseas'),
    F: NC_S('Eleni Maria Katerina Sofia Despina Ioanna Georgia Vasiliki Anastasia Dimitra Zoe Chrysa Fotini Kalliope Myrto Penelope Thalia Xanthe Irini Danae'),
    L: NC_S('Papadopoulos Pappas Georgiou Oikonomou Nikolaidis Karagiannis Vlachos Antoniou Konstantinidis Makris Dimitriou Ioannidis Alexiou Christodoulou Theodorou Angelopoulos Kyriakidis Lambrakis Stavropoulos Mavros Galanis Petridis Economou Raptis Zervas Kostopoulos Andreadis Sideris Laskaris Kalogeropoulos'),
    fem: 'gr'},
  ce: {w: 3, M: NC_S('Cian Oisín Seán Liam Darragh Ronan Eoin Fionn Cormac Declan Niall Padraig Tadhg Ruairí Callum Angus Ewan Fraser Hamish Lachlan Alasdair Struan Dougal Ciarán Brendan'),
    F: NC_S('Aoife Saoirse Niamh Siobhan Róisín Clodagh Orla Gráinne Méabh Caoimhe Ailbhe Sinéad Eilidh Isla Morag Iona Kirsty Mhairi Shona Catriona Fiona Ailsa Bríd Deirdre Eimear'),
    L: NC_S("O'Brien O'Sullivan MacLeod McCarthy Murphy Kelly Byrne Walsh O'Connor Fitzgerald Gallagher Doherty Kennedy Lynch Quinn Moran MacKenzie Campbell Fraser Sinclair Buchanan MacDonald Lennox Munro Drummond Cameron MacGregor O'Malley Brennan Keane Nolan Riordan Donnelly Sheridan Mulligan Flanagan O'Hare MacAulay Galbraith Ó_Briain Mac_Giolla")},
  ka: {w: 2, M: NC_S('Giorgi Davit Levan Irakli Nika Luka Zurab Tamaz Vakhtang Shota Aram Armen Tigran Hovhannes Gor Narek Vahe Ashot Sargis Karen'),
    F: NC_S('Nino Tamar Mariam Ana Ketevan Salome Eka Lali Natia Tsira Ani Lusine Anahit Siranush Nare Mane Gayane Armine Hasmik Tatev'),
    L: NC_S('Beridze Kapanadze Gelashvili Maisuradze Lomidze Tsiklauri Javakhishvili Chavchavadze Gogoladze Abashidze Kvaratskhelia Mchedlishvili Bagrationi Dadiani Sargsyan Petrosyan Hovhannisyan Grigoryan Harutyunyan Mkrtchyan Ghazaryan Vardanyan Avetisyan Karapetyan Aghajanian Mirzoyan')},
  fi: {w: 1, M: NC_S('Eero Aleksi Juho Lauri Matti Onni Otso Paavo Sakari Taneli Veikko Ville Ilmari Kalevi Arvo Toivo Aatos Joonas'),
    F: NC_S('Aino Eevi Ilona Kaisa Lumi Minea Nelli Oona Pihla Saara Siiri Tuuli Venla Helmi Hilla Kerttu Maija Sanni'),
    L: NC_S('Korhonen Virtanen Mäkinen Nieminen Mäkelä Hämäläinen Laine Heikkinen Koskinen Järvinen Lehtonen Lehtinen Saarinen Salminen Heinonen Niemi Heikkilä Kinnunen Salonen Turunen Salo Laitinen Tuominen Rantanen Karjalainen Jokinen Mattila Savolainen Lahtinen Ahonen')},
  am: {w: 2, M: NC_S('Itzli Cuauhtémoc Tlaloc Yaotl Tenoch Nezahual Ehecatl Inti Amaru Kusi Tupac Wayra Illari Mayta Rumi Yupanqui Atoq Sinchi Pachacuti'),
    F: NC_S('Citlali Xochitl Itzel Yaretzi Nayeli Ameyali Izel Metzli Quetzalli Tonalli Killa Nina Sisa Inti Wayta Phaqsi Ch\'aska Ayelen Rayen Nahuel'),
    L: NC_S('Mamani Quispe Condori Huanca Choque Ccori Yupanqui Huaman Apaza Ticona Coaquira Cusi Tito Atahualpa Cuauhtli Tecuani Xicotencatl Ocelotl Moctezuma Tlacaelel Nahuatlaca Painemal Catrileo Huenchumilla Antileo Llancaqueo Calfucura Nahuelpan')},
  po: {w: 2, M: NC_S('Keanu Kai Makoa Kaimana Nohea Ikaika Koa Tane Rangi Tama Wiremu Hemi Manaia Nikau Ariki Sione Tevita Losa Mana Kahu Hoku Kapono'),
    F: NC_S('Leilani Kalani Moana Malia Nalani Kailani Mahina Noelani Aroha Ataahua Kahurangi Mere Ngaio Tui Marama Losana Mele Salote Hina Anuhea Kiele Pua'),
    L: NC_S('Kahananui Kealoha Kamakau Nakamoto Akana Kaleo Mahoe Kapule Ngata Parata Tamihana Waititi Te_Rangi Te_Whare Rangihau Tuhoe Fifita Taufa Havili Faleolo Tuilagi Seumalo Lealaiauloto Tupou Vaipulu')},
  mn: {w: 1, M: NC_S('Batbayar Temujin Ganbaatar Bold Sukh Erdene Tömör Chinggis Odbayar Altan Khulan Munkh Delger Enkh Baatar Naran'),
    F: NC_S('Altantsetseg Oyuun Saraa Narantuya Enkhjargal Bolormaa Solongo Nomin Tsetseg Anu Gerel Khongorzul Uyanga Zaya Delgermaa Oyunbileg'),
    L: NC_S('Batbold Ganzorig Erdenebat Bayarsaikhan Altankhuyag Munkhbat Tsogtbaatar Dorj Ganbold Purev Naranbaatar Ochir Sukhbaatar Tumur Khurelsukh Jargal')}
};
// the old shared lists: the invented names of the Hunter world
NAME_CULTURES.cosmo = {w: 22, M: FIRST_M, F: FIRST_F, L: LAST};
const NC_IDS = Object.keys(NAME_CULTURES), NC_W = NC_IDS.reduce((s, k) => s + NAME_CULTURES[k].w, 0);
const NC_MIX = 0.35;
const ncRand = r => typeof r === 'function' ? r() : Math.random();
const ncPick = (A, r) => A[Math.floor(ncRand(r) * A.length)];
function ncCulture(r){ let x = ncRand(r) * NC_W; for(const k of NC_IDS){ x -= NAME_CULTURES[k].w; if(x < 0) return k; } return 'cosmo'; }
// the feminine form of a surname, where the culture has one; everyone else keeps it as written
function ncFem(cul, base, g){
  if(g !== 'Female') return base; const C = NAME_CULTURES[cul]; if(!C) return base;
  if(C.fem === 'sl'){ if(/(ov|ev|in|yn)$/.test(base)) return base + 'a'; if(/ski$/.test(base)) return base.slice(0, -1) + 'a'; if(/cki$/.test(base)) return base.slice(0, -1) + 'a';
    if(/ský$/.test(base)) return base.slice(0, -1) + 'á'; if(/ý$/.test(base)) return base.slice(0, -1) + 'á'; if(/(ák|ek)$/.test(base)) return base + 'ová'; if(/(ka|da)$/.test(base) && !/ić$/.test(base)) return base.slice(0, -1) + 'ová'; return base; }
  if(C.fem === 'gr'){ if(/os$/.test(base)) return base.slice(0, -2) + 'ou'; if(/is$/.test(base)) return base.slice(0, -1); if(/as$/.test(base)) return base.slice(0, -1); return base; }
  return base;
}
// a surname made from a parent's first name
function ncPat(cul, parentFirst, g){
  const C = NAME_CULTURES[cul];
  if(C && C.pat === 'is'){ const st = (C.gen && C.gen[parentFirst]) || (parentFirst.endsWith('s') ? parentFirst : parentFirst + 's'); return st + (g === 'Male' ? 'son' : g === 'Female' ? 'dóttir' : 'bur'); }
  return parentFirst;   // Ethiopian: the father's name as it is
}
const ncFirstOf = (cul, g, r) => { const C = NAME_CULTURES[cul] || NAME_CULTURES.cosmo; return g === 'Male' ? ncPick(C.M, r) : g === 'Female' ? ncPick(C.F, r) : ncPick(ncRand(r) < 0.5 ? (ncRand(r) < 0.5 ? C.M : C.F) : FIRST_N, r); };
// a family's own surname, before any feminine form: the family key every member shares
function ncFamily(cul, r){
  const C = NAME_CULTURES[cul] || NAME_CULTURES.cosmo;
  if(C.pat) return {base: C.pat === 'is' ? ncPick(C.M, r) : ncPick(C.M, r), pat: true};
  if(C.two && ncRand(r) < C.two){ let a = ncPick(C.L, r), b = ncPick(C.L, r), k = 0; while(b === a && k++ < 5) b = ncPick(C.L, r); return {base: a + ' ' + b, two: true}; }
  return {base: ncPick(C.L, r)};
}
// the family key of a surname: the part a family goes by
function ncKey(cul, last){ const C = NAME_CULTURES[cul]; if(!C || !last) return last; if(C.two && last.includes(' ') && !/^(de|da|do|dos|das|del|la)\s/i.test(last)){ const p = last.split(' '); return C.key === 'last' ? p[p.length - 1] : p[0]; } return last; }
// a new person: names from one culture (or the one given), never a full name already taken
function mkName(r, g, opt){
  opt = opt || {}; const used = opt.used;
  for(let t = 0; t < 60; t++){
    // the Hunter world mixes: about a third of people carry a first name from one culture and a surname from another
    const cul = opt.cul || ncCulture(r), fc = ncRand(r) < (opt.mix ?? NC_MIX) ? ncCulture(r) : cul, first = opt.first || ncFirstOf(fc, g, r), F = opt.fam || ncFamily(cul, r);
    const last = F.pat ? ncPat(cul, F.base, g) : ncFem(cul, F.base, g), surK = F.pat ? ncPat(cul, F.base, 'Male') : ncKey(cul, F.base);
    const name = first + ' ' + last;
    if(!used || !used.has(name) || t > 50){ if(used) used.add(name); return {first, last, surK, cul, name}; }
  }
}
// the family a person belongs to, for anyone (older records have only a name)
const surOf = x => !x ? '' : x.surK || x.last || String(x.name || '').split(' ').slice(-1)[0];
// a child's names. One parent carries the line; the child takes that parent's culture (now and then the other's first name),
// and the surname by the line's rules: two surnames where the culture uses them, a parent's name where it makes one,
// and otherwise the line's surname, joined now and then with the other parent's (never more than two parts)
function childName(line, other, g, r){
  const cul = line.cul || 'cosmo', C = NAME_CULTURES[cul] || NAME_CULTURES.cosmo;
  const pf = [line.first || String(line.name || '').split(' ')[0], other && (other.first || String(other.name || '').split(' ')[0])];
  let first; for(let t = 0; t < 8; t++){ first = ncFirstOf(other && other.cul && ncRand(r) < 0.2 ? other.cul : ncRand(r) < 0.15 ? ncCulture(r) : cul, g, r); if(!pf.includes(first)) break; }   // not a parent's own name
  const lL = line.last || String(line.name || '').split(' ').slice(1).join(' ') || surOf(line), K = surOf(line);
  let last, surK = K;
  if(C.pat) last = ncPat(cul, line.first || String(line.name || '').split(' ')[0], g);
  else if(C.two && other){ const oK = surOf(other); last = C.key === 'last' ? `${oK} ${K}` : `${K} ${oK}`; if(oK === K) last = K; }
  else if(C.fem) last = ncFem(cul, K, g);
  else if(other && surOf(other) !== K && ncRand(r) < 0.15 && !/[\s-]/.test(K) && !/[\s-]/.test(surOf(other))){ last = ncRand(r) < 0.5 ? `${K}-${surOf(other)}` : `${surOf(other)}-${K}`; }
  else last = lL.includes(' ') && !C.two ? lL : K;
  return {first, last, surK, cul, name: first + ' ' + last};
}
