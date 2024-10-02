/**
 *
 * @typedef {{
 *  id: string;
 *  title: string;
 *  details: string;
 *  thumbnal: string;
 *  imgs: string[];
 *  base_price: number;
 *  category: string[];
 *  option?: Option[]
 * }} Sach
 *
 * @typedef {{
 *   id: string;
 *   short_name: string;
 *   long_name: string;
 *   img?: string
 *   price: number
 *  }} Option
 *
 * @typedef {{
 *  id: string;
 *  name: string;
 *  long_name?: string;
 * }} Category
 *
 * @typedef {{
 *  id: string;
 *  user_id: string;
 *  sach: number;
 *  option_id?: number;
 *  quantity: number;
 *  status: "suly" | "doixacnhan" | "thanhcong";
 * }} Cart
 *
 * @typedef {{
 *  id: string;
 *  userName: string;
 *  name: string;
 *  email: string;
 *  passwd: string;
 *  phone_num: string;
 *  rule?: 'admin' | 'user';
 * }} UserInfo
 * 
 * 
 * @typedef {{
 *  id: string,
 *  data: string
 * }} imgStore
 *

 */

import uuidv4 from '../until/uuid.js';
import sanhs from './sachDb.js';
// @ts-ignore
import imgs from './imgStore.js';

/**
 *
 * lưu toàn bộ thông tin
 *
 * @type {{
 * user_info: UserInfo[];
 * category: Category[];
 * cart: Cart[];
 * sach: Sach[];
 * imgs: imgStore[];
 * }}
 */
const cache = {
    user_info: [
        {
            id: '49790139',
            userName: 'Caesar.Bosco',
            name: 'Audrey Hyatt IV',
            email: 'Rose.Haley@hotmail.com',
            phone_num: '920.669.4454 x191',
            passwd: 'jmembRtsuoo1tYI',
        },
        {
            id: '69451623',
            userName: 'Bryce.Sawayn1',
            name: 'Della Yundt',
            email: 'Nelda.Goyette10@yahoo.com',
            phone_num: '(549) 229-2115',
            passwd: 'ax5wOXVWX9c6SHb',
        },
        {
            id: '44507506',
            userName: 'Brook.Schiller58',
            name: 'Elias Conn',
            email: 'Broderick_Schoen@yahoo.com',
            phone_num: '1-793-457-6718',
            passwd: 'bhBBiBvhItPkKBW',
        },
        {
            id: '94327975',
            userName: 'Eliseo.Rutherford',
            name: 'Kristina Altenwerth MD',
            email: 'Flo.Upton@hotmail.com',
            phone_num: '498-759-0141',
            passwd: 'gy3cM6hQh4xdR1F',
        },
        {
            id: '01052182',
            userName: 'Kallie_Lueilwitz27',
            name: 'Edith Bosco',
            email: 'Keyon81@yahoo.com',
            phone_num: '427-863-4877 x45413',
            passwd: 'zxk6dV_CV48g03z',
        },
        {
            id: '53908722',
            userName: 'Jeremy_Mraz89',
            name: "Marianne O'Conner",
            email: 'Aliya_Schulist45@yahoo.com',
            phone_num: '(691) 613-5527 x964',
            passwd: 'iD54h0B9m3yWRpx',
        },
        {
            id: '62307757',
            userName: 'Myra_Cummerata1',
            name: 'Kim Morissette',
            email: 'Uriel.Wiegand@hotmail.com',
            phone_num: '1-269-524-1605 x49893',
            passwd: 'FZ1BbQLoM1PumSA',
        },
        {
            id: '29358828',
            userName: 'Alberta.Wintheiser',
            name: 'Greg Mayer',
            email: 'Brandon1@yahoo.com',
            phone_num: '624.388.3288 x55117',
            passwd: 'XHaFxWskD9Zo4WH',
        },
        {
            id: '63265670',
            userName: 'Ryann_Roob90',
            name: 'Robert Gislason',
            email: 'Jammie41@yahoo.com',
            phone_num: '553-365-4194',
            passwd: 'ab3IA5ltyvk_R8r',
        },
        {
            id: '55881507',
            userName: 'Alvah.Kihn56',
            name: 'Lillie Heathcote',
            email: 'Anne23@hotmail.com',
            phone_num: '212.888.0665 x11549',
            passwd: 'AN6qYpxTwM95J3N',
        },
        {
            id: '43702526',
            userName: 'Roxanne61',
            name: 'Glenn Brakus IV',
            email: 'Pattie62@gmail.com',
            phone_num: '1-616-619-7120 x5877',
            passwd: 'FsqBTs4oreciZGl',
        },
        {
            id: '70579732',
            userName: 'Elza_Farrell',
            name: 'Angelica Langworth',
            email: 'Letitia.Bayer@hotmail.com',
            phone_num: '339.654.9962 x99565',
            passwd: 'mLBuS0WgxCermbN',
        },
        {
            id: '64184552',
            userName: 'Yesenia24',
            name: 'Esther Rohan IV',
            email: 'Cole.Thompson@yahoo.com',
            phone_num: '832.502.5081 x3577',
            passwd: 'QvT5gm9VdMD6QbL',
        },
        {
            id: '43186083',
            userName: 'Maverick.Runolfsson90',
            name: 'Dr. Randall Schumm',
            email: 'Lisette60@hotmail.com',
            phone_num: '705-551-3097',
            passwd: 'FEgpKKXNNmGkv_j',
        },
        {
            id: '01766065',
            userName: 'Bennett_Goyette90',
            name: 'Roosevelt Volkman',
            email: 'Burnice83@yahoo.com',
            phone_num: '(795) 987-7729 x9452',
            passwd: '1OuntqnXlSPjwCx',
        },
        {
            id: '40529803',
            userName: 'Mikayla.Toy',
            name: 'Patsy Hansen PhD',
            email: 'Sheridan45@hotmail.com',
            phone_num: '1-742-408-5238 x58954',
            passwd: '08DyuzWqDx6G6B1',
        },
        {
            id: '86149811',
            userName: 'Idell87',
            name: 'Ted Jacobi',
            email: 'Dortha49@yahoo.com',
            phone_num: '611-659-9184 x51939',
            passwd: 'iYd3KtDZ0Hi3o0N',
        },
        {
            id: '30937427',
            userName: 'Kyla_Kiehn',
            name: 'Erin Brown',
            email: 'Elyse22@hotmail.com',
            phone_num: '465.272.4811 x305',
            passwd: 'basjBFrRymKcbhK',
        },
        {
            id: '59168014',
            userName: 'Etha_Maggio64',
            name: 'Maggie Mayert',
            email: 'Doris_MacGyver35@hotmail.com',
            phone_num: '801.372.2672',
            passwd: 'IRmEB5qiKfg0625',
        },
        {
            id: '51214370',
            userName: 'Christine_Waelchi79',
            name: 'Walter Feeney',
            email: 'Corbin_Von55@yahoo.com',
            phone_num: '(448) 546-9170',
            passwd: 'NDj0G4yISGKfA2K',
        },
        {
            id: '79286879',
            userName: 'Loy.Metz4',
            name: 'Zachary Blanda',
            email: 'Tiana_Hauck74@gmail.com',
            phone_num: '530.410.0983',
            passwd: 'eSKOW44eqQW9ZBv',
        },
        {
            id: '18761797',
            userName: 'Charlie91',
            name: 'Andrew Lemke',
            email: 'Krystina55@gmail.com',
            phone_num: '357.878.1289 x098',
            passwd: 'VcGi4egHy9r6foR',
        },
        {
            id: '57077347',
            userName: 'Charley_Prohaska',
            name: 'Hazel Berge',
            email: 'Meaghan.Herzog52@hotmail.com',
            phone_num: '(223) 498-1512',
            passwd: '4LMKoYIYABa96Mv',
        },
        {
            id: '34678544',
            userName: 'Ova65',
            name: 'Benjamin Kemmer',
            email: 'Sylvia_Moen50@hotmail.com',
            phone_num: '538.506.5899 x50118',
            passwd: 'f8cVTzrcp2VJzro',
        },
        {
            id: '08445288',
            userName: 'Leta83',
            name: 'Ed Harber',
            email: 'Deja_OKeefe@yahoo.com',
            phone_num: '(535) 618-9922',
            passwd: 'VdeVlQ5lvcjG21G',
        },
        {
            id: '92845903',
            userName: 'Cade.Johns-Nicolas',
            name: 'Janis Mraz',
            email: 'Demond.Schimmel@hotmail.com',
            phone_num: '(630) 702-2852 x058',
            passwd: 'Orun2yX8vUKVxNK',
        },
        {
            id: '69632002',
            userName: 'Haylee34',
            name: 'Cedric Daniel II',
            email: 'Oleta69@hotmail.com',
            phone_num: '1-772-264-2545 x313',
            passwd: '7dEP01UmQtj2LzI',
        },
        {
            id: '34616382',
            userName: 'Rose_Luettgen42',
            name: 'Guadalupe Considine',
            email: 'John_Gulgowski67@gmail.com',
            phone_num: '(771) 240-9996 x60146',
            passwd: 'TVVMxIYqhOXHxO3',
        },
        {
            id: '94711650',
            userName: 'Sydney66',
            name: 'Norman Bode',
            email: 'Aubrey.Abernathy6@hotmail.com',
            phone_num: '845-640-0603 x02049',
            passwd: 'EMYHCgjUxuaB68J',
        },
        {
            id: '95099050',
            userName: 'Garrison.Ziemann76',
            name: 'Angelo Schultz',
            email: 'Abby98@yahoo.com',
            phone_num: '(864) 873-7244',
            passwd: 'S6CDgLfNKZucSsG',
        },
        {
            id: '02207480',
            userName: 'Sophie.Jacobi',
            name: 'Lester Fahey',
            email: 'Cale.Abernathy97@hotmail.com',
            phone_num: '(831) 871-1732',
            passwd: 'Z5bEFEz_XIAHiGr',
        },
        {
            id: '35529289',
            userName: 'Maximus74',
            name: 'Bridget Gusikowski',
            email: 'Ryder_Heaney47@yahoo.com',
            phone_num: '1-440-912-2233 x75324',
            passwd: 'rs76ECWRkDtenBO',
        },
        {
            id: '57355297',
            userName: 'Elvie.Ortiz96',
            name: 'Kenneth Kris Jr.',
            email: 'Newell_Ruecker@gmail.com',
            phone_num: '709.430.5686',
            passwd: '8Ii0SBl3inZLQd0',
        },
        {
            id: '46884804',
            userName: 'Scarlett_OKon25',
            name: 'Peter Kihn',
            email: 'Jordon_Bergnaum@yahoo.com',
            phone_num: '254-519-7581 x034',
            passwd: 'B7GzzdAvGJy7oz_',
        },
        {
            id: '62058676',
            userName: 'Lelah25',
            name: 'Lindsey Schultz',
            email: 'Amiya_Christiansen61@hotmail.com',
            phone_num: '682.629.8347 x0580',
            passwd: '4otOYFSQr2gtHV6',
        },
        {
            id: '65728131',
            userName: 'Jannie_Stamm',
            name: 'Dale Muller',
            email: 'Hannah.McLaughlin@yahoo.com',
            phone_num: '879-652-1676 x043',
            passwd: 'Jx2XrwZoftweJRz',
        },
        {
            id: '59022876',
            userName: 'Adolfo.Gutmann93',
            name: 'Gabriel Bechtelar',
            email: 'Katarina.Douglas72@yahoo.com',
            phone_num: '(924) 493-8205 x9610',
            passwd: 'IrhLmhMNbKKBcaQ',
        },
        {
            id: '66621971',
            userName: 'Osvaldo.Turner',
            name: 'Jesse Hudson',
            email: 'Emmett.Schultz@yahoo.com',
            phone_num: '540-241-9381 x98356',
            passwd: 'bZO407LT3AOfsem',
        },
        {
            id: '35814787',
            userName: 'Madonna.McClure39',
            name: 'Percy Bechtelar',
            email: 'Jennifer.Swift79@hotmail.com',
            phone_num: '1-688-248-8178 x4613',
            passwd: 'NuqopCxYn3tIrlE',
        },
        {
            id: '69858110',
            userName: 'Hanna95',
            name: 'Dr. Fernando Gleichner DVM',
            email: 'Una46@yahoo.com',
            phone_num: '(647) 245-4321',
            passwd: 'waoY2GbB4P2ou8X',
        },
        {
            id: '03100231',
            userName: 'Helga.Purdy87',
            name: 'Ira Kovacek',
            email: 'Reynold27@yahoo.com',
            phone_num: '993-840-2085 x332',
            passwd: '3eK31pgbY88AmmU',
        },
        {
            id: '02894477',
            userName: 'Deondre.McLaughlin19',
            name: 'Gloria Kuhlman',
            email: 'Kelly_Abbott@gmail.com',
            phone_num: '1-626-908-6950',
            passwd: '6Y12BqewIBEkHTn',
        },
        {
            id: '64358721',
            userName: 'Anissa.Conroy',
            name: 'Perry Friesen-Huel',
            email: 'Glen.Schamberger@hotmail.com',
            phone_num: '1-762-501-3463 x025',
            passwd: 'xQbYHgPTUcFydrs',
        },
        {
            id: '16290093',
            userName: 'Daryl.Olson',
            name: 'Stanley Kuvalis-Hayes',
            email: 'Sylvan.McKenzie@yahoo.com',
            phone_num: '635-736-6664',
            passwd: 'bVCP_ydYbWJg4iR',
        },
        {
            id: '10922517',
            userName: 'Merle_Leuschke',
            name: 'Milton Rutherford Sr.',
            email: 'Araceli.Gorczany76@yahoo.com',
            phone_num: '1-648-886-9798 x12090',
            passwd: 'J55pEbyOABO9wYe',
        },
        {
            id: '70040260',
            userName: 'Maxie.Stiedemann32',
            name: 'Sadie Hane',
            email: 'Eloise_Walter52@hotmail.com',
            phone_num: '938.954.3375 x426',
            passwd: 'gTjfZ26SjHvm5yY',
        },
        {
            id: '13899899',
            userName: 'Alice0',
            name: 'Jon Bednar',
            email: 'Eldred_Hermiston47@hotmail.com',
            phone_num: '1-455-569-1474',
            passwd: 'qmqunEzKFw6TKwZ',
        },
        {
            id: '85961783',
            userName: 'Lonzo.Ebert',
            name: 'Eugene Kilback',
            email: 'Aron_Cummerata-Dickens@gmail.com',
            phone_num: '648-824-6402 x56819',
            passwd: 'k960uO9CYOEcOPT',
        },
        {
            id: '60332211',
            userName: 'Trenton_Schneider',
            name: 'Clarence Watsica',
            email: 'Tre85@yahoo.com',
            phone_num: '917-561-3924 x5976',
            passwd: 'Ob1_xJxxOMm9zF7',
        },
        {
            id: '96590138',
            userName: 'Cade94',
            name: 'Amelia Kutch II',
            email: 'Edyth.White43@yahoo.com',
            phone_num: '1-586-618-0027 x01645',
            passwd: '4kB83cAsatuUfwJ',
        },
        {
            id: '89380380',
            userName: 'Rachael_Stroman19',
            name: 'Dana Harvey',
            email: 'Rozella69@yahoo.com',
            phone_num: '725.285.5181 x231',
            passwd: 'zGgH9oXNF6ai1VM',
        },
        {
            id: '68180665',
            userName: 'Halie_Bogisich-Larson',
            name: 'Isaac Brown PhD',
            email: 'Valentin.Willms40@hotmail.com',
            phone_num: '1-732-732-6057 x8929',
            passwd: 'iYzbtNg_0qg2Grf',
        },
        {
            id: '38850704',
            userName: 'William.Monahan72',
            name: 'Lucy Dicki',
            email: 'Marcel_Kris83@gmail.com',
            phone_num: '1-680-966-6573 x3961',
            passwd: 'DvnBUKaU7A0jQWl',
        },
        {
            id: '26910964',
            userName: 'Edgar_Batz',
            name: "Dr. Estelle O'Hara",
            email: 'Meggie54@gmail.com',
            phone_num: '866-612-3472 x9899',
            passwd: 'ydKFO97DqwzTX5z',
        },
        {
            id: '47074258',
            userName: 'Rey.Boyer',
            name: 'Eddie Fisher',
            email: 'Waino58@hotmail.com',
            phone_num: '(261) 611-1618 x710',
            passwd: '7tZCr4nxlCnQrLy',
        },
        {
            id: '82499659',
            userName: 'Kavon.Ledner56',
            name: 'Julio Gerlach II',
            email: 'Vincenzo_Moen78@gmail.com',
            phone_num: '408-895-5795 x5329',
            passwd: 'EyOysF5g1Qm93Hx',
        },
        {
            id: '39959863',
            userName: 'Hobart.Murray-Kerluke',
            name: 'Michelle Zboncak',
            email: 'Jamarcus.Rice@yahoo.com',
            phone_num: '303.999.4549 x5286',
            passwd: '5FPfnmNARFBd2RS',
        },
        {
            id: '13112240',
            userName: 'Jaqueline.Cummings',
            name: 'Regina Olson',
            email: 'Carli65@hotmail.com',
            phone_num: '1-574-949-9683 x41598',
            passwd: 'NWcheBx6pUsoqmW',
        },
        {
            id: '19579079',
            userName: 'Helena.Wolff',
            name: 'Miss Sally Wilkinson-Cruickshank',
            email: 'Stephan.Anderson@yahoo.com',
            phone_num: '922.787.7463',
            passwd: 'XtS8UOF3jC8S_E5',
        },
        {
            id: '08791856',
            userName: 'Litzy91',
            name: 'Evan Feeney',
            email: 'Ola_Braun@yahoo.com',
            phone_num: '(952) 496-3725',
            passwd: '7_LnmJKVGtc2SVD',
        },
        {
            id: '92138385',
            userName: 'Jessyca14',
            name: 'Delia Baumbach',
            email: 'Gage31@gmail.com',
            phone_num: '214.646.8214 x04278',
            passwd: 'UMqrLRD_2OkZuS6',
        },
        {
            id: '94888677',
            userName: 'Tamia_McClure94',
            name: 'Danny Schoen',
            email: 'Wade75@gmail.com',
            phone_num: '(679) 269-4359',
            passwd: '2OJqyYQLdQWUJ3T',
        },
        {
            id: '15180955',
            userName: 'Rosemary.Herzog21',
            name: 'Lynn Hamill',
            email: 'Loraine_Armstrong55@hotmail.com',
            phone_num: '341.720.1981 x5938',
            passwd: '8mR_5uIiqDKByIB',
        },
        {
            id: '06295670',
            userName: 'Christine_Lockman',
            name: 'Warren Dare',
            email: 'Karine86@hotmail.com',
            phone_num: '327.486.6428 x2340',
            passwd: 'TXN_MpsYnJtWcSZ',
        },
        {
            id: '36638680',
            userName: 'Lula82',
            name: 'Aaron Brown',
            email: 'Justus_Russel16@gmail.com',
            phone_num: '816-689-8893 x1207',
            passwd: 'R7b9HsKoVRfylKa',
        },
        {
            id: '12840793',
            userName: 'Kirstin_Terry',
            name: 'Ellen Gulgowski',
            email: 'Kaci86@hotmail.com',
            phone_num: '831-898-6452 x1091',
            passwd: 'e4YsCwaPgHSaQEA',
        },
        {
            id: '22746783',
            userName: 'Josefina_Feeney',
            name: 'Suzanne Barrows',
            email: 'Stewart.Johnston@yahoo.com',
            phone_num: '891.241.6372 x9468',
            passwd: 'krY7t2wgY7sT_ht',
        },
        {
            id: '22190511',
            userName: 'Roxane.Braun',
            name: 'Kenneth Padberg I',
            email: 'Cynthia.Paucek30@gmail.com',
            phone_num: '1-542-541-5701 x044',
            passwd: 'S6BR_3MAc6EqRP9',
        },
        {
            id: '61046961',
            userName: 'Derrick.OKeefe66',
            name: 'Barry Haley III',
            email: 'Krystal_Predovic96@hotmail.com',
            phone_num: '1-222-907-8393 x5861',
            passwd: '2o7Cyf3NRmFn0SJ',
        },
        {
            id: '71294592',
            userName: 'Savanna59',
            name: 'Bryant Upton',
            email: 'Abdiel73@yahoo.com',
            phone_num: '1-243-324-4146 x67416',
            passwd: '2XIC3YIPZ_T3efK',
        },
        {
            id: '06519053',
            userName: 'Jacklyn67',
            name: 'Laverne Hermiston',
            email: 'Yesenia62@gmail.com',
            phone_num: '1-516-824-5519 x014',
            passwd: 'e2eJSj6FQNhbWWC',
        },
        {
            id: '34519360',
            userName: 'Felicia81',
            name: 'Dennis Murphy',
            email: 'Lulu73@yahoo.com',
            phone_num: '(566) 223-9823 x92234',
            passwd: '7oQeUdpJhIxJPSg',
        },
        {
            id: '00314887',
            userName: 'Berniece_Renner93',
            name: 'Elmer Botsford',
            email: 'Stephany66@gmail.com',
            phone_num: '865-853-6234 x335',
            passwd: 'ym48gAae3PGtNvN',
        },
        {
            id: '77253020',
            userName: 'Harrison.Emard5',
            name: 'Ella Connelly-Labadie',
            email: 'Therese_Rodriguez@hotmail.com',
            phone_num: '667-485-8753 x50724',
            passwd: 'lSyLrphHSHhr1_k',
        },
        {
            id: '80797581',
            userName: 'Therese.Turcotte',
            name: 'Peter Simonis',
            email: 'Kallie.Littel3@hotmail.com',
            phone_num: '960-966-5069 x3823',
            passwd: 'QIu3V5_TJVWgTB_',
        },
        {
            id: '35982281',
            userName: 'Ervin_Emard',
            name: 'Francis Wolf',
            email: 'Jay.Balistreri@yahoo.com',
            phone_num: '712.438.3665 x0657',
            passwd: 'wY0Eqcwbi2czty9',
        },
        {
            id: '29906871',
            userName: 'Kian69',
            name: 'Steve Moore',
            email: 'Durward60@yahoo.com',
            phone_num: '802-585-7539 x937',
            passwd: 'KqWR_quOW__1vNt',
        },
        {
            id: '07670224',
            userName: 'Herta.Buckridge91',
            name: 'Bethany Deckow-Moore',
            email: 'Gene.Balistreri@gmail.com',
            phone_num: '694.416.6621 x856',
            passwd: 'kLWZm9GNuxGDrRc',
        },
        {
            id: '95982620',
            userName: 'Laila.Spinka63',
            name: 'Tracy Ebert',
            email: 'Alejandra.Wehner@gmail.com',
            phone_num: '1-700-607-2434 x37810',
            passwd: 'fCLtar4Wg2GOsum',
        },
        {
            id: '00042081',
            userName: 'Jackson17',
            name: 'Sara Lebsack DDS',
            email: 'Osbaldo_Wuckert41@hotmail.com',
            phone_num: '723.457.0938',
            passwd: '95HZT8Eg8dILsqs',
        },
        {
            id: '97641653',
            userName: 'Petra.Bradtke15',
            name: 'Jill Heathcote',
            email: 'Frankie82@gmail.com',
            phone_num: '1-325-504-9373 x4180',
            passwd: 'QUY6FzoUVABTuUc',
        },
        {
            id: '67446363',
            userName: 'Burley.Harvey49',
            name: 'Elizabeth McLaughlin',
            email: 'Reanna22@yahoo.com',
            phone_num: '(556) 606-1468 x736',
            passwd: 'st91cxSV85T3AWb',
        },
        {
            id: '20919729',
            userName: 'Jade_Metz12',
            name: 'Beverly Bins',
            email: 'Kari_Tillman@gmail.com',
            phone_num: '611-831-8054 x75399',
            passwd: 'FQbBXyalMragW95',
        },
        {
            id: '98406133',
            userName: 'Dudley69',
            name: 'Charlene Erdman',
            email: 'Jennyfer_Yundt-Durgan25@hotmail.com',
            phone_num: '1-240-211-4579 x72334',
            passwd: 'FnZp8agxANj37qP',
        },
        {
            id: '05027540',
            userName: 'Alana.Gutkowski',
            name: 'Marcella Prosacco',
            email: 'Hayden.Stiedemann@hotmail.com',
            phone_num: '682-213-1774',
            passwd: 'fv2hHVYl1kwcFVs',
        },
        {
            id: '64063946',
            userName: 'Judy_Reinger',
            name: 'Jacquelyn Reichel',
            email: 'Lavonne94@yahoo.com',
            phone_num: '531.946.8581',
            passwd: 'o6aOTOalA_7ON3t',
        },
        {
            id: '91168745',
            userName: 'Isabell24',
            name: 'Kay Terry',
            email: 'Johathan.Maggio64@hotmail.com',
            phone_num: '1-730-986-3775 x45137',
            passwd: 'E5oh2Rtap2PcFx8',
        },
        {
            id: '10490633',
            userName: 'Dax_Davis',
            name: 'Darlene Farrell',
            email: 'Trevion_Bruen-Herman47@hotmail.com',
            phone_num: '727-383-3945 x8575',
            passwd: 'z_1R6e7hYZAt8Ag',
        },
        {
            id: '41315362',
            userName: 'Dakota_Kuhic',
            name: 'Derek Barton',
            email: 'Reba24@hotmail.com',
            phone_num: '1-940-914-9062 x23277',
            passwd: '29Is7SPdw9kciaa',
        },
        {
            id: '97302226',
            userName: 'Esther_Schmitt17',
            name: 'Lila Turner',
            email: 'Asha32@yahoo.com',
            phone_num: '686.681.8461 x6987',
            passwd: 'mQVLjLdkFT6i6c9',
        },
        {
            id: '43039266',
            userName: 'Crawford0',
            name: 'Mr. Wilfred Predovic',
            email: 'Dayna14@hotmail.com',
            phone_num: '1-229-862-8087 x97907',
            passwd: 'WV0DCYxyRRQOaM1',
        },
        {
            id: '90389012',
            userName: 'Sydnee1',
            name: 'Dianne Schinner',
            email: 'Eldred.Conroy@hotmail.com',
            phone_num: '768.488.1923 x03968',
            passwd: 'lY71jW85M1O3kMK',
        },
        {
            id: '51549111',
            userName: 'Nigel58',
            name: 'Darryl Trantow',
            email: 'Rhianna.Beatty0@gmail.com',
            phone_num: '(635) 788-3505 x5709',
            passwd: 'CSs4lgnzy6EPjoJ',
        },
        {
            id: '57632301',
            userName: 'Mylene37',
            name: "Sheryl O'Kon I",
            email: 'Jacklyn_Gleason18@yahoo.com',
            phone_num: '653.406.6524 x17298',
            passwd: 'NLGW88BktjOJnSo',
        },
        {
            id: '70618506',
            userName: 'Rosanna28',
            name: 'Sherry Shanahan',
            email: 'Allison_Wyman@hotmail.com',
            phone_num: '1-563-951-8675 x61406',
            passwd: 'N5pj2y3XI4gdAwq',
        },
        {
            id: '33559379',
            userName: 'Eric53',
            name: 'Alvin Bahringer',
            email: 'Olen_Howe@hotmail.com',
            phone_num: '290-613-5170 x13368',
            passwd: 'cg4GipUhS2_pniV',
        },
        {
            id: '63082977',
            userName: 'Reta4',
            name: 'Meredith Ferry',
            email: 'Geo21@yahoo.com',
            phone_num: '(371) 235-4740 x9492',
            passwd: 'JAI5XTwLcnpt5cJ',
        },
        {
            id: '61353710',
            userName: 'Rusty.Ryan96',
            name: 'Dianne Oberbrunner',
            email: 'Donnell_Wilderman66@yahoo.com',
            phone_num: '(218) 477-6778',
            passwd: 'eSdfcj9OR4ofgGt',
        },
        {
            id: '81294933',
            userName: 'Manuel_Zulauf42',
            name: 'Renee Grady DVM',
            email: 'Kirstin.Russel21@hotmail.com',
            phone_num: '1-487-375-0644 x80839',
            passwd: 'ppurc2QSPHDZKqB',
        },
        {
            id: '24884559',
            userName: 'Monty_Gerlach26',
            name: 'Lester Daugherty',
            email: 'Sanford81@gmail.com',
            phone_num: '1-281-354-7444 x899',
            passwd: 'qM0iRPax6vGnUXh',
        },
        {
            id: '36114325',
            userName: 'Agnes92',
            name: 'Nadine Marvin',
            email: 'Emily.Feeney56@gmail.com',
            phone_num: '342.291.2314 x1577',
            passwd: 'dJlIRhHOqt2VB_k',
        },
        {
            id: '14779557',
            userName: 'Martine_Balistreri',
            name: 'Erin Bailey DDS',
            email: 'Dagmar67@hotmail.com',
            phone_num: '(951) 408-2879',
            passwd: 'eRtwjus1ZHAZHED',
        },
        {
            id: '17512878',
            userName: 'Marguerite_Bins37',
            name: 'Willis VonRueden',
            email: 'Dariana_Haag@yahoo.com',
            phone_num: '737-404-7925 x95845',
            passwd: 'Y03J61tDDQ1UgAX',
        },
        {
            id: '50636486',
            userName: 'Darron30',
            name: 'Douglas Haag',
            email: 'Antonette_Williamson10@hotmail.com',
            phone_num: '(803) 497-4985 x20373',
            passwd: 'xp_MItaMBpUs21Q',
        },
        {
            id: '93335705',
            userName: 'Brooks_Boyer40',
            name: 'Nichole McClure',
            email: 'Zelda_Kihn@hotmail.com',
            phone_num: '1-955-606-4402',
            passwd: 'NW7VFQ83LhP7VLv',
        },
        {
            id: '78244216',
            userName: 'Donald.Reichel90',
            name: 'Robyn Muller',
            email: 'Lazaro_Effertz@yahoo.com',
            phone_num: '(598) 945-9283 x29759',
            passwd: 'nuYQpBTOtVrgnIn',
        },
        {
            id: '04459007',
            userName: 'Anna_Thompson25',
            name: 'Sheldon Kunze',
            email: 'Marcelo72@yahoo.com',
            phone_num: '866-456-4937',
            passwd: 'F6aNi4Y63i6lv8l',
        },
        {
            id: '57320565',
            userName: 'River.Murazik',
            name: 'Donna Hirthe',
            email: 'Delmer_Maggio33@yahoo.com',
            phone_num: '1-504-531-1559 x9403',
            passwd: 'nfEmxOFSFn0DFKh',
        },
        {
            id: '50535582',
            userName: 'Lillian.Streich96',
            name: 'Patsy Breitenberg',
            email: 'Trent_Skiles@gmail.com',
            phone_num: '(689) 805-9648 x96229',
            passwd: 'bSmn7Mrt_oOaii1',
        },
        {
            id: '08011618',
            userName: 'Isabel_Schultz-Harvey90',
            name: 'Mitchell Quitzon',
            email: 'Jeffery32@hotmail.com',
            phone_num: '591.742.7706',
            passwd: 'WCj6upylr9AVdu2',
        },
        {
            id: '00842352',
            userName: 'Milo.Sanford55',
            name: 'Mr. Roger Bashirian DDS',
            email: 'Brown_Hickle42@hotmail.com',
            phone_num: '1-914-440-6363 x66548',
            passwd: 'e1EDJ5IrwdgB5DX',
        },
        {
            id: '38522920',
            userName: 'Miller12',
            name: 'Shawn Cole',
            email: 'Mark.Emard@yahoo.com',
            phone_num: '685.406.7183',
            passwd: 'lLaFqy29idUGr9H',
        },
        {
            id: '17512334',
            userName: 'Laverna8',
            name: 'Dexter Lakin-Gleichner PhD',
            email: 'Bartholome45@hotmail.com',
            phone_num: '1-602-669-1952',
            passwd: 'OzpN7kTGEokHhPW',
        },
        {
            id: '48052461',
            userName: 'Domingo_Cormier10',
            name: 'Claudia Weber',
            email: 'Ken8@hotmail.com',
            phone_num: '966-349-8166 x6231',
            passwd: '09vMb7DfjmjlGds',
        },
        {
            id: '25123101',
            userName: 'Madie_Wiegand12',
            name: 'Donna Ortiz',
            email: 'Sammy.West-Hahn71@yahoo.com',
            phone_num: '693.622.9200 x21319',
            passwd: 'dddn0tBlVvtLXmL',
        },
        {
            id: '06908340',
            userName: 'Larry.Gusikowski',
            name: 'Ms. Susan Romaguera',
            email: 'Alyce_Goyette@yahoo.com',
            phone_num: '660-740-2290 x35092',
            passwd: 'Jq02ds0Uox4cB6m',
        },
        {
            id: '54588174',
            userName: 'Tristian_Kuhlman67',
            name: 'Tina Rowe Jr.',
            email: 'Abdiel_Berge@hotmail.com',
            phone_num: '(539) 905-0825 x5050',
            passwd: 'DWg4MmNOn7G1lFO',
        },
        {
            id: '99423102',
            userName: 'Douglas24',
            name: 'Florence Toy Jr.',
            email: 'Osbaldo_Brekke10@hotmail.com',
            phone_num: '745-801-9086',
            passwd: 'qDg6tnIDanYSP8y',
        },
        {
            id: '75240627',
            userName: 'Zackery22',
            name: 'Horace Pfannerstill',
            email: 'Lucinda76@yahoo.com',
            phone_num: '(574) 302-0518 x02017',
            passwd: 'Ehwj9cBX9L6gPFc',
        },
        {
            id: '02378557',
            userName: 'Nia.Leannon',
            name: 'Raquel Goodwin',
            email: 'Dolores_Sipes@yahoo.com',
            phone_num: '1-441-676-9777 x00840',
            passwd: 'LJryUVi2y97h2EW',
        },
        {
            id: '58634044',
            userName: 'Marjorie.Leannon',
            name: 'Billy Tremblay',
            email: 'Justyn32@yahoo.com',
            phone_num: '1-618-546-0892 x8939',
            passwd: 'zD7Be66xzUlha9_',
        },
        {
            id: '79784792',
            userName: 'Jessika64',
            name: 'Kristi Walker',
            email: 'Johnathan36@gmail.com',
            phone_num: '1-916-531-6727 x065',
            passwd: '_eNveANOGsLEBzV',
        },
        {
            id: '11206971',
            userName: 'Owen85',
            name: 'Rickey Ratke PhD',
            email: 'Earline3@yahoo.com',
            phone_num: '625.566.3052 x116',
            passwd: 'clte5ZutmphcvAj',
        },
        {
            id: '66582794',
            userName: 'Audra_Krajcik',
            name: 'Rosalie Rogahn',
            email: 'Grayson_Aufderhar@hotmail.com',
            phone_num: '436-261-2785',
            passwd: '5chhVeMSgKWjjCh',
        },
        {
            id: '83959126',
            userName: 'Hassan_Reilly',
            name: 'Rudolph Rosenbaum',
            email: 'Shaun.Hilll@hotmail.com',
            phone_num: '366-946-7987 x7445',
            passwd: 'jxvd3_4GooAdDGT',
        },
        {
            id: '10856592',
            userName: 'Baron.Frami',
            name: 'Patty Cronin',
            email: 'Shannon_Kulas@yahoo.com',
            phone_num: '668-382-7818',
            passwd: 'pLvQR_ibLfWbWq7',
        },
        {
            id: '77882768',
            userName: 'Fermin_Kshlerin',
            name: 'Dr. Irving Gerlach',
            email: 'Verona_Wolf@gmail.com',
            phone_num: '780.347.3155 x763',
            passwd: 'JAsCT7OHpgCdPVi',
        },
        {
            id: '78691575',
            userName: 'Katharina.Brakus',
            name: 'Danielle Pollich',
            email: 'Torrance.Wisoky29@yahoo.com',
            phone_num: '662.371.1874 x805',
            passwd: 'LsKp2gYfuVbeNWR',
        },
        {
            id: '51789708',
            userName: 'Faustino46',
            name: 'Henry Bernhard II',
            email: 'Aurelia_Shanahan49@hotmail.com',
            phone_num: '772-271-8031',
            passwd: 'bWcDIf0qDHEDuG4',
        },
        {
            id: '23743786',
            userName: 'Tamia.Langworth17',
            name: 'Shannon Walker I',
            email: 'Delaney.Mraz@gmail.com',
            phone_num: '(489) 216-5997',
            passwd: 'QXfCA_VQrxEVExq',
        },
        {
            id: '74747652',
            userName: 'Joaquin.Padberg53',
            name: 'Malcolm Miller',
            email: 'Ron54@gmail.com',
            phone_num: '500-347-5051 x677',
            passwd: 'Km9muSib46sh3db',
        },
        {
            id: '09690900',
            userName: 'Ali75',
            name: 'Marlon Farrell',
            email: 'Pearl_Schinner31@gmail.com',
            phone_num: '387-959-4906',
            passwd: 'x7HNHxHqmwsyhi1',
        },
        {
            id: '68324021',
            userName: 'Stephon.Jenkins',
            name: 'Antoinette Cartwright',
            email: 'Joan_Schulist32@hotmail.com',
            phone_num: '1-799-987-7923 x3456',
            passwd: 'E3LDlEc1spkrJz9',
        },
        {
            id: '00209235',
            userName: 'Phyllis_McClure0',
            name: 'Patty Wisozk-Halvorson',
            email: 'Katlynn.Windler@hotmail.com',
            phone_num: '547-711-1837 x29331',
            passwd: 'FxTAHVTKvh8iuUS',
        },
        {
            id: '59353531',
            userName: 'Leif.Feest45',
            name: 'Danielle Feest',
            email: 'Alana_Hoeger@hotmail.com',
            phone_num: '(607) 296-6456 x1342',
            passwd: 'X0ZC43_Q9HnhRCg',
        },
        {
            id: '44033867',
            userName: 'Kody_Swift1',
            name: 'Cody Swaniawski',
            email: 'Jazlyn.Emmerich-Corwin@yahoo.com',
            phone_num: '650-623-5957 x580',
            passwd: 'LfYCHR35QjKXZoY',
        },
        {
            id: '09612914',
            userName: 'Faustino_Pagac97',
            name: 'Ernestine Kuhic',
            email: 'Watson8@gmail.com',
            phone_num: '674.906.0604 x0913',
            passwd: 'WXNMQHsDWitF4Cr',
        },
        {
            id: '05150076',
            userName: 'Cecil.Schneider43',
            name: 'Bertha Jakubowski',
            email: 'Danny_Fahey@yahoo.com',
            phone_num: '1-666-822-8757 x8514',
            passwd: '0DM_5cFP6RtZtyj',
        },
        {
            id: '32486128',
            userName: 'Richmond57',
            name: 'Malcolm Beer PhD',
            email: 'Georgette.Schamberger70@yahoo.com',
            phone_num: '1-694-761-6423',
            passwd: 'hynCfmo61AKfEfN',
        },
        {
            id: '41953467',
            userName: 'Abbie.Daugherty',
            name: 'Lester Koelpin',
            email: 'Philip15@yahoo.com',
            phone_num: '696-552-6716 x6059',
            passwd: 'SOYjf9M9jMPfPp7',
        },
        {
            id: '90909213',
            userName: 'Sheldon.Cremin34',
            name: 'Elena Pagac',
            email: 'Jerod.Harris@gmail.com',
            phone_num: '(611) 829-3801',
            passwd: 'mMCHWGigKuaBNfN',
        },
        {
            id: '69840765',
            userName: 'Emerald73',
            name: 'June Zboncak',
            email: 'Fermin_Wolff59@hotmail.com',
            phone_num: '231.301.7104 x760',
            passwd: '9LVBV0ut0sjiS6W',
        },
        {
            id: '84650494',
            userName: 'Amari_Fisher',
            name: 'Antonia Harris-Steuber',
            email: 'Genevieve_Lockman39@hotmail.com',
            phone_num: '910.774.7514 x15554',
            passwd: 'dXMOgeOTwsGTmPV',
        },
        {
            id: '25336234',
            userName: 'Broderick70',
            name: 'Mable Kohler',
            email: 'Quinten.Mante77@yahoo.com',
            phone_num: '1-387-300-8226 x4338',
            passwd: 'rvDgCNgUfZR21_R',
        },
        {
            id: '30090989',
            userName: 'Henderson50',
            name: 'Cedric Waelchi',
            email: 'Moriah27@gmail.com',
            phone_num: '1-614-572-1055 x151',
            passwd: '3GRVwLUzvZZkHuP',
        },
        {
            id: '96712304',
            userName: 'Sigmund24',
            name: 'Terence Johnson',
            email: 'Nona68@hotmail.com',
            phone_num: '1-851-711-5708 x583',
            passwd: '_6nTbNhAAQMl0tn',
        },
        {
            id: '99833496',
            userName: 'Javonte.Douglas',
            name: 'Chad Bednar',
            email: 'Humberto.Turner@hotmail.com',
            phone_num: '629-291-9278 x8950',
            passwd: 'RKDUSF72XSjuAUr',
        },
        {
            id: '13122279',
            userName: 'Maximilian89',
            name: 'Jon Wisoky',
            email: 'Gladys_Bernhard28@hotmail.com',
            phone_num: '815.691.0815',
            passwd: 'x5VE9X7m5iR6pCu',
        },
        {
            id: '02103230',
            userName: 'Silas.Toy',
            name: 'Connie Howell',
            email: 'Charles8@gmail.com',
            phone_num: '392.568.6458 x8759',
            passwd: 'Eixdn4njJ3mtJAw',
        },
        {
            id: '91203262',
            userName: 'Theresa.Pfeffer29',
            name: 'Connie Maggio',
            email: 'Laurie.Purdy@hotmail.com',
            phone_num: '1-212-958-5649',
            passwd: 'tZfz7QsCemHz2NI',
        },
        {
            id: '84012423',
            userName: 'Winifred_Koss56',
            name: 'Ronnie Balistreri',
            email: 'Taylor_Okuneva23@hotmail.com',
            phone_num: '(778) 882-8146 x955',
            passwd: '8gyCLZ3YofrA7ie',
        },
        {
            id: '45432873',
            userName: 'Teresa_Kihn',
            name: 'Bernadette Hahn',
            email: 'Daron.Herzog@hotmail.com',
            phone_num: '870.870.9404 x142',
            passwd: 'Vzf8KUqdCtkUwv_',
        },
        {
            id: '91105746',
            userName: 'Joyce92',
            name: 'Jamie Stokes',
            email: 'Treva_Kunze12@yahoo.com',
            phone_num: '585-785-0708 x0174',
            passwd: 'SrzpGKeDO5VcXbl',
        },
        {
            id: '95599449',
            userName: 'Domenic.Walsh',
            name: 'Deanna Schaden',
            email: 'Santiago.Rosenbaum@yahoo.com',
            phone_num: '754-268-8584 x51404',
            passwd: 'ZMVG4cmZcGwEHRB',
        },
        {
            id: '95286732',
            userName: 'Melany.Lowe79',
            name: 'Jill Moore',
            email: 'Mackenzie.Carter36@hotmail.com',
            phone_num: '(789) 264-9163',
            passwd: '1IfBGDktlh4bSjR',
        },
        {
            id: '02096885',
            userName: 'Ike.Dickens91',
            name: 'Owen Kemmer',
            email: 'Russ.Fahey@gmail.com',
            phone_num: '(712) 369-6166 x925',
            passwd: 'R2GGIdPvOIydnfK',
        },
        {
            id: '17721822',
            userName: 'Peyton_Goyette',
            name: 'Paula Hauck',
            email: 'Constantin.Skiles-Ondricka@hotmail.com',
            phone_num: '(456) 328-6572',
            passwd: '7d1skwQ3egsYNol',
        },
        {
            id: '02236788',
            userName: 'Sharon_Ziemann57',
            name: 'Deborah Kling Sr.',
            email: 'Patience.Green72@yahoo.com',
            phone_num: '(286) 404-0081 x37251',
            passwd: 'ofPUiqQOV2eT4MU',
        },
        {
            id: '51511750',
            userName: 'Justina.Keeling10',
            name: 'Lewis Bruen',
            email: 'Selmer.Cassin-Kshlerin6@gmail.com',
            phone_num: '1-334-343-5599 x1353',
            passwd: 'td2B9Zboqgf8TnP',
        },
        {
            id: '83518537',
            userName: 'Novella71',
            name: 'Ashley Wehner',
            email: 'Furman.Rogahn76@yahoo.com',
            phone_num: '1-911-830-0119 x3939',
            passwd: 'wJazo7ZKUSSMcNW',
        },
        {
            id: '79428817',
            userName: 'Koby.Nolan39',
            name: 'Mr. Leo Abbott V',
            email: 'Martin11@gmail.com',
            phone_num: '(316) 847-0786 x887',
            passwd: 'tUk_GCxbwW4zslu',
        },
        {
            id: '50030189',
            userName: 'Samson_Greenfelder',
            name: 'Jeannette Fritsch',
            email: 'Roxanne_Bernhard@hotmail.com',
            phone_num: '(477) 516-8170 x795',
            passwd: 'UK6mZhTGvoRP058',
        },
        {
            id: '26477029',
            userName: 'Katharina_OHara',
            name: 'Mattie Lind',
            email: 'Geovany59@hotmail.com',
            phone_num: '230.514.9229',
            passwd: 'hr99jUVTZTkMeTq',
        },
        {
            id: '62560165',
            userName: 'Kristian84',
            name: 'Pearl Mitchell Sr.',
            email: 'Norma.Waters@hotmail.com',
            phone_num: '(328) 625-2070',
            passwd: '3zhEmtF_y2DpSgA',
        },
        {
            id: '94225843',
            userName: 'Lina_Weimann15',
            name: 'Bernadette Armstrong',
            email: 'Kyle_Kunze13@hotmail.com',
            phone_num: '710.910.9486 x27800',
            passwd: 'tSQsaXxU7IqSl2J',
        },
        {
            id: '70121240',
            userName: 'Lacy_Hahn82',
            name: 'Clint Corwin',
            email: 'Sierra_Okuneva56@yahoo.com',
            phone_num: '982.977.4186',
            passwd: 'Q4vf_PUCbkVhHcQ',
        },
        {
            id: '73935961',
            userName: 'Lucas3',
            name: 'Devin Quitzon',
            email: 'Arielle.Cormier53@yahoo.com',
            phone_num: '1-300-768-0721',
            passwd: 'PVuGdTzkVb8DDiy',
        },
        {
            id: '86914776',
            userName: 'Melvin.Wiegand',
            name: 'Daryl Baumbach',
            email: 'Theresia_West@yahoo.com',
            phone_num: '(375) 303-6245 x0983',
            passwd: 'Qa3PPHurIn01Zb_',
        },
        {
            id: '79753211',
            userName: 'Sam.Monahan0',
            name: 'Marco Boyle',
            email: 'Forest_Kuhlman69@hotmail.com',
            phone_num: '700-907-2474 x167',
            passwd: 'FQwL8S8iFGfPSz4',
        },
        {
            id: '02541058',
            userName: 'Shanny13',
            name: 'Joan Hettinger',
            email: 'Rosemary.Mann12@yahoo.com',
            phone_num: '646-599-9992 x62969',
            passwd: 'HYefkEOyQV8Qygv',
        },
        {
            id: '24227573',
            userName: 'Andy.Okuneva',
            name: 'Martin Daugherty',
            email: 'Fiona.Langworth@yahoo.com',
            phone_num: '948.954.4531 x1193',
            passwd: '7kGQkLblW8cFOF2',
        },
        {
            id: '31950053',
            userName: 'Linnea_Bednar',
            name: 'Pedro Leannon IV',
            email: 'Haylie.Watsica11@yahoo.com',
            phone_num: '1-251-266-6975 x5267',
            passwd: 'bAKRGPBy8IIQwWs',
        },
        {
            id: '42183512',
            userName: 'Wilfrid71',
            name: 'Louis Kreiger',
            email: 'Jamel.Pouros@gmail.com',
            phone_num: '(576) 282-4673 x57971',
            passwd: 'nbpBl6LSUzipLTT',
        },
        {
            id: '48622222',
            userName: 'Sheldon.Macejkovic23',
            name: 'Forrest Bartell',
            email: 'Jody23@yahoo.com',
            phone_num: '1-254-849-0163 x819',
            passwd: 'p0brgkrusU0UQvz',
        },
        {
            id: '20456109',
            userName: 'Beryl_Konopelski43',
            name: 'Willis Champlin Sr.',
            email: 'Laverna21@hotmail.com',
            phone_num: '217.255.7206',
            passwd: 'BBWWQk2LWeLJVUh',
        },
        {
            id: '03747720',
            userName: 'Eloise49',
            name: 'Cassandra Stroman',
            email: 'Tanner.Koss@hotmail.com',
            phone_num: '656.682.2669 x85434',
            passwd: 'OQWz9pWNOrAIjTG',
        },
        {
            id: '00260936',
            userName: 'Jana_Schaden80',
            name: 'Dawn Runte',
            email: 'Alivia_Klein73@gmail.com',
            phone_num: '(416) 445-7232 x4319',
            passwd: 'CsCQ2mP2kpYpRqo',
        },
        {
            id: '56737182',
            userName: 'Manuel_Treutel',
            name: 'Irvin Murphy',
            email: 'Savannah.Mertz@gmail.com',
            phone_num: '(742) 309-7815 x66992',
            passwd: '0zSFrTBYJRLY_uY',
        },
        {
            id: '07953454',
            userName: 'Enoch27',
            name: 'Christy VonRueden',
            email: 'Anastasia67@yahoo.com',
            phone_num: '398.662.7231 x6528',
            passwd: '5a8iGjoDjHyuCzy',
        },
        {
            id: '54451949',
            userName: 'Bryana_Corwin',
            name: 'Reginald Purdy',
            email: 'Lon.Toy85@gmail.com',
            phone_num: '834.909.4814',
            passwd: '9MiigSbwNwPUB6e',
        },
        {
            id: '09230859',
            userName: 'Arnoldo23',
            name: 'Willard Kessler',
            email: 'Rodolfo56@gmail.com',
            phone_num: '347.240.9532 x71411',
            passwd: 'gzwtzdUxFknmhfU',
        },
        {
            id: '26345312',
            userName: 'Lucile.Jast62',
            name: 'Nina Tillman',
            email: 'Alvena_Gutmann@yahoo.com',
            phone_num: '958-947-1546',
            passwd: 'kD9lZXa3r8QVPfI',
        },
        {
            id: '85460970',
            userName: 'Lizzie_Goodwin',
            name: 'Naomi Roberts Sr.',
            email: 'Anais.Ward49@hotmail.com',
            phone_num: '1-515-827-1167',
            passwd: 'oRg4RM4aWT7bhqC',
        },
        {
            id: '36851109',
            userName: 'Guy_Olson78',
            name: 'Miss Florence Ondricka',
            email: 'Alec_Considine4@hotmail.com',
            phone_num: '245.739.8567',
            passwd: 'W5QBpDW10qAmKpw',
        },
        {
            id: '02995460',
            userName: 'Verdie_Emmerich',
            name: 'Mrs. Hannah Schamberger',
            email: 'Ozella45@hotmail.com',
            phone_num: '583-223-2899 x89057',
            passwd: 'XY3YsD847L0279t',
        },
        {
            id: '67625755',
            userName: 'Margarete14',
            name: 'Ora Mills',
            email: 'Lindsay_Senger@yahoo.com',
            phone_num: '766.547.6988',
            passwd: 'AACq2SwxK2R5zrA',
        },
        {
            id: '08438667',
            userName: 'Jaleel_Cummerata',
            name: 'Santos Schneider',
            email: 'Amy_Rath19@yahoo.com',
            phone_num: '1-932-380-1359 x3760',
            passwd: '2wXqICRphti_rf7',
        },
        {
            id: '52166266',
            userName: 'Delta.White80',
            name: 'Josh Klein',
            email: 'Lenna84@yahoo.com',
            phone_num: '1-866-403-0531 x08560',
            passwd: 'ONDnXqJlYy5sQIb',
        },
        {
            id: '61980166',
            userName: 'Eddie_Jakubowski90',
            name: 'Sandy Gleichner',
            email: 'Melvin.Abernathy-VonRueden@yahoo.com',
            phone_num: '925-317-4759 x103',
            passwd: '5oTiU7BXcIPMnUJ',
        },
        {
            id: '59124308',
            userName: 'Sid.Hodkiewicz46',
            name: 'Gustavo Bins',
            email: 'Jarrett_Abernathy@yahoo.com',
            phone_num: '804.260.9941 x155',
            passwd: 'cIYil1wJdz7JI9g',
        },
        {
            id: '15822438',
            userName: 'Zachariah.Ratke',
            name: 'Mr. Loren Homenick I',
            email: 'Gladys_Haag@hotmail.com',
            phone_num: '1-692-446-8870 x1093',
            passwd: 'wFhTvx5UU0J8m63',
        },
        {
            id: '15929895',
            userName: 'Della_Parker47',
            name: 'Alison Beier',
            email: 'Lonie69@gmail.com',
            phone_num: '209.770.4402 x188',
            passwd: 'qKUy84ntkJ1XTfY',
        },
        {
            id: '68186558',
            userName: 'Julien_Koelpin',
            name: 'Vernon Hills',
            email: 'Albert.Roob46@yahoo.com',
            phone_num: '(620) 917-0391 x210',
            passwd: 'lscnFw7sDjmIg0G',
        },
        {
            id: '64183115',
            userName: 'Edmund.Christiansen8',
            name: 'Justin Donnelly DVM',
            email: 'Nicola.Little@gmail.com',
            phone_num: '(356) 820-8459 x686',
            passwd: '5fSXaR8_dutHm31',
        },
        {
            id: '76284986',
            userName: 'Otis.Steuber',
            name: 'Clay Bartell',
            email: 'Trever_Heidenreich94@yahoo.com',
            phone_num: '946-263-9546',
            passwd: 'bKtKW_lwvF4RnHP',
        },
        {
            id: '60438565',
            userName: 'Devin54',
            name: 'Dr. Elisa Heller',
            email: 'Francesca.Kulas@gmail.com',
            phone_num: '460-653-7266 x371',
            passwd: 'mz4spBjFr3AfU_u',
        },
        {
            id: '86837296',
            userName: 'Ezekiel71',
            name: 'Jesus Murphy',
            email: 'Dominique96@gmail.com',
            phone_num: '636.673.9456',
            passwd: 'cfalAYNscwrVDRW',
        },
        {
            id: '21830501',
            userName: 'Andy.Fisher',
            name: 'Constance Glover',
            email: 'Kaylee.Farrell@hotmail.com',
            phone_num: '1-563-253-9565',
            passwd: 'Ce00euxLt9mV3UT',
        },
        {
            id: '11598928',
            userName: 'Hunter.Ortiz',
            name: 'Mr. Roosevelt Muller',
            email: 'Krystina70@hotmail.com',
            phone_num: '907.798.2546',
            passwd: 'kMyUZDrwER2g3q6',
        },
        {
            id: '53470735',
            userName: 'Cielo.Rogahn',
            name: 'Candace Kiehn',
            email: 'Abelardo_Prosacco33@gmail.com',
            phone_num: '1-550-627-6911 x286',
            passwd: 'ffWlHT3Ad45Q0el',
        },
    ],
    category: [
        {
            id: 'mc',
            name: 'môn chung',
            long_name: 'môn chung',
        },
        {
            id: 'hoidap',
            name: 'hỏi đáp',
            long_name: 'hỏi đáp',
        },
        {
            id: 'QD',
            name: 'Khoa Quản trị Kinh doanh',
        },
        {
            id: 'VD',
            name: 'Khoa Văn hoá và Du lịch',
        },
        {
            id: 'KT',
            name: 'Khoa SP Kĩ thuật',
        },
        {
            id: '09',
            name: 'Phòng Giáo dục thường xuyên',
        },
        {
            id: 'CT',
            name: 'Khoa Công nghệ thông tin',
        },
        {
            id: 'TT',
            name: 'Khoa Thư viện - Văn phòng',
        },
        {
            id: 'GM',
            name: 'Khoa Giáo dục Mầm non',
        },
        {
            id: 'NN',
            name: 'Khoa Ngoại ngữ',
        },
        {
            id: 'XH',
            name: 'Khoa SP Khoa học Xã hội',
        },
        {
            id: 'TD',
            name: 'Khoa Toán - ứng dụng',
        },
        {
            id: 'TE',
            name: 'Khoa Tài chính - Kế toán',
        },
        {
            id: 'QG',
            name: 'Khoa Giáo dục',
        },
        {
            id: 'MO',
            name: 'Khoa Môi trường',
        },
        {
            id: 'TN',
            name: 'Khoa SP Khoa học Tự nhiên',
        },
        {
            id: 'GT',
            name: 'Khoa Giáo dục Tiểu học',
        },
        {
            id: 'NT',
            name: 'Khoa Nghệ thuật',
        },
        {
            id: 'LU',
            name: 'Khoa Luật',
        },
        {
            id: 'DV',
            name: 'Khoa Điện tử viễn thông',
        },
        {
            id: 'LC',
            name: 'Khoa Giáo dục chính trị',
        },
    ],
    cart: [],
    sach: sanhs,
    imgs: imgs,
};

/**
 * lấy
 * lấy tất cả
 * delete
 * update
 * thêm
 */

class FakeDatabase {
    /**
     *
     * @param {string} user_id
     * @returns {UserInfo | undefined }
     */
    getUserInfoByUserId(user_id) {
        return cache.user_info.find((e) => e.id == user_id);
    }

    /**
     *
     * @returns {UserInfo[]}
     */
    getAllUserInfo() {
        return cache.user_info;
    }

    /**
     *
     * @param {string} user_id
     */
    deleteUserById(user_id) {
        const index = cache.user_info.findIndex((e) => e.id == user_id);
        cache.user_info.splice(index, 1);
    }

    /**
     *
     * @param {string} email
     * @param {string} password
     * @returns {UserInfo | undefined}
     */
    getUserInfoByUserNameAndPassword(email, password) {
        const user_info = cache.user_info.find((e) => e.email == email && e.passwd == password);
        return user_info;
    }

    /**
     *
     * @param {string} password
     * @param {string} account_name
     * @param {string} display_name
     * @param {string} std
     * @param {string} email
     */
    createUserInfo(password, account_name, display_name, std, email) {
        const user_id = uuidv4();
        cache.user_info.push({
            id: user_id,
            userName: account_name,
            name: display_name,
            email,
            passwd: password,
            phone_num: std,
            rule: 'user',
        });
    }

    /**
     *
     * @param {string} id
     * @param {string} userName
     * @param {string} name
     * @param {string} email
     * @param {string} passwd
     * @param {string} phone_num
     * @param {"user" | "admin"| undefined} rule
     */
    updateUserInfo(id, userName, name, email, passwd, phone_num, rule) {
        const newUser = {
            id,
            userName,
            name,
            email,
            passwd,
            phone_num,
            rule,
        };

        const index = cache.user_info.findIndex((e) => e.id === id);
        cache.user_info[index] = newUser;
    }

    /**
     *
     * @returns {Sach[]}
     */
    getAllSach() {
        return cache.sach;
    }

    /**
     *
     * @param {string} sach_id
     * @returns {Sach | undefined}
     */
    getSachById(sach_id) {
        return cache.sach.find((e) => e.id == sach_id);
    }

    /**
     *
     * @param {Sach} data
     */
    addSach(data) {
        const sach_id = uuidv4();
        data.id = sach_id;
        cache.sach.push(data);
    }

    /**
     * @param {Sach} data
     */
    updateSach(data) {
        const index = cache.sach.findIndex((e) => e.id == data.id);
        cache.sach[index] = data;
    }

    /**
     *
     * @param {string} sach_id
     */
    deleteSachById(sach_id) {
        const index = cache.sach.findIndex((e) => e.id == sach_id);
        cache.sach.splice(index, 1);
    }

    /**
     *
     * @returns {Cart[]}
     */
    getALlCart() {
        return cache.cart;
    }

    /**
     *
     * @param {string} user_id
     * @returns {Cart[]}
     */
    getCartByUserId(user_id) {
        return cache.cart.filter((e) => e.user_id == user_id);
    }

    /**
     *
     * @param {string} cart_id
     * @param {"suly" | "doixacnhan" | "thanhcong"} status
     */
    updateCartStatus(cart_id, status) {
        const index = cache.cart.findIndex((e) => e.id == cart_id);
        cache.cart[index].status = status;
    }

    /**
     *
     * @returns {Category[]}
     */
    getAllCategory() {
        return cache.category;
    }

    /**
     *
     * @returns {imgStore[]}
     */
    getAllImgs() {
        return cache.imgs;
    }

    /**
     *
     * @param {string} id
     * @returns {imgStore | undefined}
     */
    getImgById(id) {
        return cache.imgs.find((e) => e.id == id);
    }

    /**
     *
     * @param {imgStore} img
     */
    addImg(img) {
        const id = uuidv4();
        img.id = id;
        cache.imgs.push(img);
    }

    /**
     *
     * @param {imgStore} img
     */
    updateImg(img) {
        const index = cache.imgs.findIndex((e) => (e.id = img.id));
        cache.imgs[index] = img;
    }
}

const fackDatabase = new FakeDatabase();
export default fackDatabase;
