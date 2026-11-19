DELETE FROM moods;
DELETE FROM microbes;

INSERT INTO microbes
  (sprite_id, game_key, category, display_order, name_th, scientific_name, rarity, gram, shape, trait)
VALUES
  ('ecoli', 'Ec', 'Bacterium', 1, 'อีโคไล', 'Escherichia coli', 'common', 'แกรมลบ', 'แท่งสั้น', 'แท่งสั้น (bacillus) มีแฟลเจลลาโดยรอบตัว และขนเกาะ (fimbriae) พบได้ในลำไส้คนทั่วไป'),
  ('klebsiella', 'Kp', 'Bacterium', 2, 'เคล็บซิเอลลา', 'Klebsiella pneumoniae', 'common', 'แกรมลบ', 'แท่ง + แคปซูลหนา', 'แท่งห่อด้วยแคปซูลวุ้นหนา (mucoid) เหนียวเป็นยาง ช่วยหลบภูมิคุ้มกัน ไม่มีแฟลเจลลา'),
  ('saureus', 'Sa', 'Bacterium', 3, 'สแตฟิโลค็อกคัส ออเรียส', 'Staphylococcus aureus', 'common', 'แกรมบวก', 'กลมเกาะกันเป็นพวงองุ่น', 'เซลล์กลมเกาะกลุ่มคล้ายพวงองุ่น และเม็ดสีทอง (aureus = สีทอง) ที่เป็นที่มาของชื่อ'),
  ('enterococcus', 'En', 'Bacterium', 4, 'เอนเทอโรค็อกคัส', 'Enterococcus faecium / faecalis', 'common', 'แกรมบวก', 'กลมรี เรียงเป็นสายสั้น', 'เซลล์กลมรีต่อกันเป็นสายสั้น ผนังเซลล์หนา (วงแหวนชั้นนอก) จึงทนทานมาก'),
  ('pseudomonas', 'Pa', 'Bacterium', 5, 'ซูโดโมแนส แอรูจิโนซา', 'Pseudomonas aeruginosa', 'common', 'แกรมลบ', 'แท่งเรียว + แฟลเจลลาเส้นเดียว', 'แท่งเรียว มีแฟลเจลลาเส้นเดียวที่ปลาย สร้างเม็ดสีน้ำเงินเขียว (pyocyanin) และเมือกไบโอฟิล์ม'),
  ('lactobacillus', 'Lb', 'Bacterium', 6, 'แลคโตบาซิลลัส', 'Lactobacillus', 'common', 'แกรมบวก', 'แท่งยาว ต่อกันเป็นสาย', 'แท่งยาวเรียวต่อกันเป็นสาย สร้างกรดแลกติก พบในโยเกิร์ต อาหารหมัก และร่างกายบางส่วน'),
  ('bacillus', 'Bs', 'Bacterium', 7, 'บาซิลลัส ซับทิลิส', 'Bacillus subtilis', 'common', 'แกรมบวก', 'แท่ง + สปอร์ทนทาน', 'แท่งที่สร้างสปอร์ (endospore) เปลือกหนาทนความร้อนและแห้งแล้ง — เม็ดสีทองในตัว'),
  ('spneumoniae', 'Sp', 'Bacterium', 8, 'สเตรปโตค็อกคัส นิวโมเนียอี', 'Streptococcus pneumoniae', 'uncommon', 'แกรมบวก', 'คู่รูปหัวหอก + แคปซูล', 'เซลล์รูปหัวหอก (lancet) จับคู่กัน ปลายแหลมอยู่ด้านนอก ห่อด้วยแคปซูลน้ำตาลโพลิแซ็กคาไรด์'),
  ('hinfluenzae', 'Hi', 'Bacterium', 9, 'ฮีโมฟิลัส อินฟลูเอนเซ', 'Haemophilus influenzae', 'uncommon', 'แกรมลบ', 'แท่งสั้นป้อม จิ๋ว', 'แท่งสั้นป้อมตัวจิ๋ว ต้องการสาร X (ฮีมิน) และ V จากเลือด — เลี้ยงบนวุ้นช็อกโกแลต'),
  ('acinetobacter', 'Ab', 'Bacterium', 10, 'อะซิเนโตแบคเตอร์ บาวมานนี', 'Acinetobacter baumannii', 'uncommon', 'แกรมลบ', 'แท่งสั้นป้อม จับคู่ + เกราะ', 'แท่งสั้นป้อมมักอยู่เป็นคู่ ทนแห้งและดื้อยาสูง — จึงใส่เกราะเหล็กและหมวกนิรภัย'),
  ('mycoplasma', 'Mp', 'Bacterium', 11, 'ไมโคพลาสมา นิวโมเนียอี', 'Mycoplasma pneumoniae', 'uncommon', 'ไม่มีผนังเซลล์', 'ก้อนเจลลี่ไร้รูปทรง', 'ไม่มีผนังเซลล์ จึงเป็นก้อนนิ่มเปลี่ยนรูปได้ (pleomorphic) มี "ปุ่มจมูก" ไว้เกาะและไถล — เพนิซิลลินจึงไม่ได้ผล'),
  ('yersinia', 'Yp', 'Bacterium', 12, 'เยอร์ซิเนีย เพสทิส', 'Yersinia pestis', 'uncommon', 'แกรมลบ', 'แท่งสั้นป้อม ย้อมติดสองขั้ว', 'แท่งสั้นป้อมย้อมติดสีเข้มที่ปลายสองด้าน (เหมือนเข็มกลัด) ต้นเหตุกาฬโรค แพร่ผ่านหมัดหนู'),
  ('vibrio', 'Vc', 'Bacterium', 13, 'วิบริโอ คอเลอรี', 'Vibrio cholerae', 'uncommon', 'แกรมลบ', 'แท่งโค้งคล้ายจุลภาค', 'แท่งโค้งเหมือนเครื่องหมายจุลภาค (comma) มีแฟลเจลลาปลายเดียว ว่ายพุ่งเร็ว อยู่ในน้ำ ต้นเหตุอหิวาตกโรค'),
  ('gardnerella', 'Gv', 'Bacterium', 14, 'การ์ดเนอเรลลา วาจินาลิส', 'Gardnerella vaginalis', 'rare', 'แกรมแปรผัน', 'แท่งสั้นป้อม เกาะเซลล์เยื่อบุ', 'ย้อมแกรมได้ทั้งบวกและลบ (สีม่วงผสมเขียว) เกาะผิวเซลล์เยื่อบุเกิด "clue cell" และปล่อยกลิ่นคาวปลา'),
  ('sars2', 'covid', 'Virus', 15, 'SARS-CoV-2', 'COVID-19', 'epic', 'ไวรัส', 'ทรงกลม + หนามรูปมงกุฎ', 'ไวรัสทรงกลมมีเยื่อหุ้ม หนามโปรตีน S ล้อมรอบเหมือนมงกุฎ (corona) ข้างในมีสาย RNA ขดอยู่'),
  ('ebola', 'ebola', 'Virus', 16, 'Ebola virus', 'Ebola disease', 'legendary', 'ไวรัส', 'เส้นยาว ปลายขดเป็นตะขอ', 'ไวรัสรูปเส้นด้ายยาว (filovirus) ปลายงอเป็นตะขอคล้ายไม้เท้าคนเลี้ยงแกะ มีหนามไกลโคโปรตีนเต็มผิว');

INSERT INTO moods (game_mood, sprite_expression, display_order)
VALUES
  ('neutral', 'random', 1),
  ('happy', 'smile', 2),
  ('sad', 'cry', 3),
  ('shy', 'shy', 4),
  ('angry', 'angry', 5),
  ('sly', 'sly', 6),
  ('worried', 'curious', 7),
  ('surprised', 'shocked', 8),
  ('excited', 'shocked', 9),
  ('dying', 'cry', 10);
