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