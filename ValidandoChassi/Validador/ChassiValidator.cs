using System;
namespace Validador
{
    public class ChassiValidator
    {
        private string _chassi { get; set; }
        public string IdentificacaoInternacional { get; set; }
        public string RegiaoGeografica { get; }
        public string PaisDeOrigem { get; }
        public string TipoVeiculo { get; set; }
        public string Modelo { get; set; }
        public string Versao { get; set; }
        public string Carroceiria { get; set; }
        public string Motorizacao { get; set; }

        public string NumeroConstante { get; set; }

        public string AnoFabricacaoEFabrica { get; set; }

        public string NumeroDeSerie { get; set; }

        public ChassiValidator(string chassi)
        {
            _chassi=chassi;
            if (_chassi.Length!=17)
                throw new System.Exception("Numero do chassi deve ter 17 caracteres");
            IdentificacaoInternacional = _chassi.Substring(0,3);
            RegiaoGeografica= GetRegiaoGeografica(IdentificacaoInternacional.Substring(0,1));
            TipoVeiculo=_chassi.Substring(3,6);
            AnoFabricacaoEFabrica= _chassi.Substring(9,2);
            NumeroDeSerie= _chassi.Substring(11,6);

            
        }

        private string GetRegiaoGeografica(string idRegiao)
        {
            switch (idRegiao.ToUpper())
            {
                case "1": return "EUA";
                case "3": return "México";
                case "8": return "Améria do Sul/Argentina";
                case "9": return "Améria do Sul/Brasil";
                case "A": return "AFRICA DO SUL/COSTA DOMARFIM";
                case "B": return "ANGOLA /AFRICA/TANZANIA";
                case "J": return "Japão";
                case "V": return "França";
                case "W": return "Alemanha";
                case "Z": return "Itália";
                default: return "";
            }
        }

    private string GetPaisOrigem(string idPais)
        {
            switch (idPais.ToUpper())
            {
                case "A":case "E": return "Brasil";
               //TODO PEGAR O RESTO DOS PAISES
                default: return "";
            }
        }      

        private int transliterate  (char c)   {
            return "0123456789.ABCDEFGH..JKLMN.P.R..STUVWXYZ".IndexOf(c) % 10;
        }
        private char  getCheckDigit (string vin)  {
            string map = "0123456789X";
            string weights = "8765432X098765432";
            int sum = 0;
            for (int i = 0; i < 17; ++i) {
                sum += transliterate(vin[i]) * map.IndexOf(weights[i]);
            }
            return map[(sum % 11)];
        }
        public bool Validate()
        {
             if (_chassi.Length != 17) return false;
            return getCheckDigit(_chassi) == _chassi[8];
        }

    public int getYear (string pos7,string pos10)  {
        int[] years = {1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039};
        string [] values = {"A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "V", "W", "X", "Y", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "V", "W", "X", "Y", "1", "2", "3", "4", "5", "6", "7", "8", "9"};
        int i = 0;
        if (string.IsNullOrEmpty(pos7)) {
            i = Array.LastIndexOf( values,pos10);
        } else {
            i = Array.IndexOf(values,pos10);
        }
        return years[i];
    }  
    public string getCountry (string wmi)  {
        string[] codes ={"AAV", "AHT", "AFA", "CL9", "JA", "JC1", "JF", "JHL", "JHM", "JMB", "JM6", "JN", "JS", "JT", "JY", "KL", "KM", "KN", "KPT", "L6T", "LBE", "LBV", "LDC", "LE4", "LFM", "LFP", "LFV", "LGB", "LGJ", "LGW", "LGX", "LH1", "LHG", "LJ1", "LJD", "LLV", "LMG", "LPA", "LS5", "LSG", "LSJ", "LSV", "LTV", "LVG", "LVH", "LVR", "LVS", "LVV", "LWV", "LZW", "MS0", "NMT", "NMO", "PL1", "SAJ", "SAL", "SAR", "SAT", "SB1", "SCC", "SCF", "SCE", "SFD", "SHH", "SHS", "SJN", "TCC", "TMA", "TMB", "TRU", "TSM", "U5Y", "UU9", "VA0", "VF1", "VF2", "VF3", "VF4", "VF5", "VF6", "VF7", "VF8", "VF9", "VFE", "VNK", "VSS", "VV9", "WAG", "WAU", "WAP", "WBA", "WBS", "WBX", "WDB", "WDC", "WDD", "WMX", "WEB", "WF0", "WJM", "WJR", "WKK", "WMA", "WME", "WMW", "WP0", "WP1", "WUA", "WVG", "WVW", "WV1", "WV2", "W09", "W0L", "W0SV", "XLR", "YK1", "YS2", "YS3", "YS4", "YTN", "YV1", "YV2", "YV3", "ZA9", "ZAM", "ZAR", "ZCF", "ZFA", "ZFF", "ZGA", "ZHW", "ZLA", "1B", "1C", "1F", "1G", "1G1", "1G3", "1G9", "1GC", "1GM", "1HG", "1J", "1L", "1M", "1N", "1VW", "1YV", "2DG", "2F", "2G", "2G1", "2G2", "2HG", "2HH", "2HJ", "2HK", "2HM", "2M", "2T", "3F", "3G", "3HG", "3HM", "3KP", "3N", "3VW", "4F", "4J", "4M", "4S3", "4S4", "4S6", "4T", "4US", "5FN", "5J6", "5L", "5N", "5T", "5U", "5X", "5YJ", "55", "6F", "6G", "6G1", "6G2", "6H", "6MM", "6T1", "7A3", "8AP", "8AF", "8AG", "8AW", "8AJ", "8A1", "8AC", "8BC", "8AD", "8C3", "8AT", "9BD", "9BG", "9BW", "9BF", "93H", "9BR", "936", "935", "93Y", "93X", "9BH", "95P", "94D", "98R", "988", "98M", "9BM", "99A", "99J", "9C2", "9C6", "9CD", "93W", "93Z", "953", "9BS", "9BV", "9UJ", "9UK", "9UW"};
        string[] countries = {"South Africa", "South Africa", "South Africa", "Tunisia", "Japan", "Japan", "Japan", "Japan", "Japan", "Japan", "Japan", "Japan", "Japan", "Japan", "Japan", "South Korea", "South Korea", "South Korea", "South Korea", "China", "China", "China", "China", "China", "China", "China", "China", "China","China","China", "China", "China", "China", "China", "China", "China", "China", "China", "China", "China", "China", "China", "China", "China", "China", "China", "China", "China", "China", "China", "Myanmar", "Turkey", "Turkey", "Malaysia", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "Switzerland", "Czech Republic", "Czech Republic", "Hungary", "Hungary", "Slovakia", "Romania", "Austria", "France", "France", "France", "France", "France", "France", "France", "France", "France", "France", "France", "Spain", "Spain", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Netherlands", "Finland", "Sweden", "Sweden", "Sweden", "Sweden", "Sweden", "Sweden", "Sweden", "Italy", "Italy", "Italy", "Italy", "Italy", "Italy", "Italy", "Italy", "Italy", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "Canada", "Canada", "Canada", "Canada", "Canada", "Canada", "Canada", "Canada", "Canada", "Canada", "Canada", "Canada", "Mexico", "Mexico", "Mexico", "Mexico", "Mexico", "Mexico", "Mexico", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "United States", "Australia", "Australia", "Australia", "Australia", "Australia", "Australia", "Australia", "New Zealand", "Argentina", "Argentina", "Argentina", "Argentina", "Argentina", "Argentina", "Argentina", "Argentina", "Argentina", "Argentina", "Argentina", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil","Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Brazil", "Uruguay", "Uruguay", "Uruguay"};
        int i =Array.IndexOf(codes,wmi);
        if (i < 0) {
            i = Array.IndexOf(codes,wmi.Substring(0, 2));
        }
        return countries[i];
    }  
    public string getManufacturer  (string wmi)  {
        string[] codes = {"AAV", "AHT", "AFA", "CL9", "JA", "JC1", "JF", "JHL", "JHM", "JMB", "JM6", "JN", "JS", "JT", "JY", "KL", "KM", "KN", "KPT", "L6T", "LBE", "LBV", "LDC", "LE4", "LFM", "LFP", "LFV", "LGB", "LGJ", "LGW", "LGX", "LH1", "LHG", "LJ1", "LJD", "LLV", "LMG", "LPA", "LS5", "LSG", "LSJ", "LSV", "LTV", "LVG", "LVH", "LVR", "LVS", "LVV", "LWV", "LZW", "MS0", "NMT", "NMO", "PL1", "SAJ", "SAL", "SAR", "SAT", "SB1", "SCC", "SCF", "SCE", "SFD", "SHH", "SHS", "SJN", "TCC", "TMA", "TMB", "TRU", "TSM", "U5Y", "UU9", "VA0", "VF1", "VF2", "VF3", "VF4", "VF5", "VF6", "VF7", "VF8", "VF9", "VFE", "VNK", "VSS", "VV9", "WAG", "WAU", "WAP", "WBA", "WBS", "WBX", "WDB", "WDC", "WDD", "WMX", "WEB", "WF0", "WJM", "WJR", "WKK", "WMA", "WME", "WMW", "WP0", "WP1", "WUA", "WVG", "WVW", "WV1", "WV2", "W09", "W0L", "W0SV", "XLR", "YK1", "YS2", "YS3", "YS4", "YTN", "YV1", "YV2", "YV3", "ZA9", "ZAM", "ZAR", "ZCF", "ZFA", "ZFF", "ZGA", "ZHW", "ZLA", "1B", "1C", "1F", "1G", "1G1", "1G3", "1G9", "1GC", "1GM", "1HG", "1J", "1L", "1M", "1N", "1VW", "1YV", "2DG", "2F", "2G", "2G1", "2G2", "2HG", "2HH", "2HJ", "2HK", "2HM", "2M", "2T", "3F", "3G", "3HG", "3HM", "3KP", "3N", "3VW", "4F", "4J", "4M", "4S3", "4S4", "4S6", "4T", "4US", "5FN", "5J6", "5L", "5N", "5T", "5U", "5X", "5YJ", "55", "6F", "6G", "6G1", "6G2", "6H", "6MM", "6T1", "7A3", "8AP", "8AF", "8AG", "8AW", "8AJ", "8A1", "8AC", "8BC", "8AD", "8C3", "8AT", "9BD", "9BG", "9BW", "9BF", "93H", "9BR", "936", "935", "93Y", "93X", "9BH", "95P", "94D", "98R", "988", "98M", "9BM", "99A", "99J", "9C2", "9C6", "9CD", "93W", "93Z", "953", "9BS", "9BV", "9UJ", "9UK", "9UW"};
        string[] manufacturers = {"Volkswagen", "Toyota", "Ford", "Wallyscar", "Isuzu", "Fiat Automobiles/Mazda", "Fuji Heavy Industries", "Honda", "Honda", "Mitsubishi", "Mazda", "Nissan", "Suzuki", "Toyota", "Yamaha", "Daewoo/GM Korea", "Hyundai", "Kia", "SsangYong", "Geely", "Beijing Hyundai", "BMW Brilliance", "Dongfeng Peugeot-Citroen", "Beijing Benz", "FAW Toyota (Sichuan)", "FAW Car", "FAW-Volkswagen", "Dongfeng Nissan", "Dongfeng Fengshen", "Great Wall (Havel)", "BYD Auto", "FAW Haima", "Guangzhou Honda", "JAC", "Dongfeng Yueda Kia", "Lifan", "GAC Trumpchi", "Changan PSA (DS Automobiles)", "Changan Suzuki", "SAIC General Motors", "SAIC MG", "SAIC Volkswagen", "FAW Toyota (Tianjin)", "GAC Toyota", "Dongfeng Honda", "Changan Mazda", "Changan Ford", "Chery", "GAC Fiat", "SAIC GM Wuling", "KIA Myanmar", "Toyota", "Ford Otosan", "Proton", "Jaguar", "Land Rover", "Rover", "Triumph", "Toyota", "Lotus Cars", "Aston Martin Lagonda Limited", "DeLorean", "Alexander Dennis", "Honda", "Honda", "Nissan", "Micro Compact Car AG (SMART 1998-1999)", "Hyundai", "Skoda", "Audi", "Suzuki", "Kia", "Dacia", "OAF", "Renault", "Renault", "Peugeot", "Talbot", "Iveco Unic SA", "Renault Trucks/Volvo", "Citroen", "Matra/Talbot/Simca", "Bugatti", "IvecoBus", "Toyota", "SEAT", "Tauro Sport Auto", "Neoplan", "Audi", "Alpina", "BMW", "BMW M", "BMW", "Mercedes-Benz", "DaimlerChrysler AG/Daimler AG", "DaimlerChrysler AG/Daimler AG", "DaimlerChrysler AG/Daimler AG", "EvoBus", "Ford of Europe", "Iveco", "Irmscher", "Karl Kassbohrer Fahrzeugwerke", "MAN", "Smart", "Mini", "Porsche car", "Porsche SUV", "Quattro", "Volkswagen", "Volkswagen", "Volkswagen Commercial Vehicles", "Volkswagen Commercial Vehicles", "Ruf Automobile", "Opel/Vauxhall", "Opel Special Vehicles", "DAF Trucks", "Saab", "Scania, Sodertalje", "Saab", "Scania, Katrineholm", "Saab NEVS", "Volvo Cars", "Volvo Trucks", "Volvo Buses", "Bugatti", "Maserati", "Alfa Romeo", "Iveco", "Fiat Automobiles", "Ferrari", "IvecoBus", "Lamborghini", "Lancia", "Dodge", "Chrysler", "Ford", "General Motors", "Chevrolet", "Oldsmobile", "Google", "Chevrolet", "Pontiac", "Honda", "Jeep", "Lincoln", "Mercury", "Nissan", "Volkswagen", "Mazda", "Ontario Drive & Gear", "Ford", "General Motors", "Chevrolet", "Pontiac", "Honda", "Acura", "Honda", "Honda", "Hyundai", "Mercury", "Toyota", "Ford", "General Motors", "Honda", "Honda", "Kia", "Nissan", "Volkswagen", "Mazda", "Mercedes-Benz", "Mercury", "Subaru", "Subaru", "Honda", "Toyota", "BMW", "Honda", "Honda", "Lincoln", "Hyundai", "Toyota", "BMW", "Hyundai/Kia", "Tesla", "Mercedes-Benz", "Ford", "General Motors", "Chevrolet", "Pontiac", "Holden", "Mitsubishi", "Toyota", "Honda", "Fiat", "Ford", "General Motors", "Volkswagen", "Toyota", "Renault", "Mercedes-Benz", "Citroen", "Peugeot", "Honda", "Iveco", "Fiat Automoveis", "General Motors", "Volkswagen", "Ford", "Honda", "Toyota", "Peugeot", "Citroen", "Renault", "Souza Ramos - Mitsubishi/Suzuki", "Hyundai Motor Company/Hyundai", "CAOA/Hyundai", "Nissan", "Chery", "Jeep", "BMW", "Mercedes-Benz", "Audi", "JLR Jaguar Land Rover", "Honda Motorcycles", "Yamaha", "Suzuki Motorcycles", "Fiat Professional", "Iveco", "VW Trucks/MAN", "Scania", "Volvo Trucks", "Chery", "Lifan", "Kia"};
        int i = Array.IndexOf(codes,wmi);
        if (i < 0) {
            i = Array.IndexOf(codes,wmi.Substring(0, 2));
        }
        return manufacturers[i];
    }    
        public bool ValidarDigito()
        {
            //KMHJU819BCU368279
            int soma, numero, resto;
            string chasiNumeric="";
            string digito;
   
            soma=0;
            for (int i = 0; i < _chassi.Length; i++)
            {
                var cPart = _chassi[i];
                if (char.IsNumber(cPart))          
                {      
                    numero= int.Parse(cPart.ToString());
                }
                else
                {
                    numero= GetValByLetter(cPart);
                    if (numero<=0)
                    {
                        Console.WriteLine("Chassi falso as letras “I”, “O” e “Q” são proibidas");
                        return false;
                    }
                }
                chasiNumeric = chasiNumeric  + numero.ToString();
                switch (i+1)
                {
                    case 1: case 11: soma += numero *8;break;
                    case 2:case 12:  soma +=   numero * 7;break;
                    case 3 :case 13:  soma +=   numero * 6;break;
                    case 4:case  14:  soma +=  numero * 5;break;
                    case 5: case 15:  soma +=   numero * 4;break;
                    case 6: case 16:  soma +=   numero * 3;break;
                    case 7:case 17:  soma +=   numero * 2;break;
                    case 8   :  soma +=   numero * 10;break;
                    case 9   :  soma +=   numero * 0;break;
                    case 10  :  soma +=   numero * 9; break;              
                    default:
                        break;
                }
                
                Console.WriteLine($"Soma parcial: {soma}");            
            }
            Console.WriteLine($"Chassi numerico: {chasiNumeric}");
            resto = (soma ) % 11;
            Console.WriteLine($"Resto: {resto}");
            if (resto==10)
                digito="X";
            else            
                digito = resto.ToString();
            Console.WriteLine($"Digito Calculado: {digito}");    
            Console.WriteLine($"Digito Real: {_chassi[8].ToString()}");    
            return digito== _chassi[8].ToString();
        }
        private int GetValByLetter(char letra)
        {
            int letraInt=0;
            switch (letra)
            {
                case 'A':case 'J': letraInt=1;break;
                case 'B':case 'K':case 'S': letraInt=2;break;
                case 'C': case 'L':  case 'T': letraInt=3;break;
                case 'D': case 'M': case 'U': letraInt=4;break;
                case 'E': case 'N':case 'V':letraInt=5;break;
                case 'F': case 'W': letraInt=6;break;
                case 'G': case 'P':case 'X':  letraInt=7;break;
                case 'H': case 'Y': letraInt=8;break;
                case 'R':case 'Z':  letraInt=9;break;  

                case 'I': letraInt=9;letraInt=-1;break;         
                case 'O': letraInt=6;letraInt=-1;break;                 
                case 'Q': letraInt=8;letraInt=-1;break;  
                                 
                                 
                default:
                letraInt=-1;break; 
            }
            return letraInt;
        }
    }
}