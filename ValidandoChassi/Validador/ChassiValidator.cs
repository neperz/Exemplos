using System;
namespace Validador
{
    public class ChassiValidator
    {
        private string _chassi { get; set; }
        public string IdentificacaoInternacional { get; set; }

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
            TipoVeiculo=_chassi.Substring(3,6);
            AnoFabricacaoEFabrica= _chassi.Substring(9,2);
            NumeroDeSerie= _chassi.Substring(11,6);

            
        }
        public bool Validar()
        {
            //KMHJU819BCU368279
            int soma, numero, resto;
            string digito;
   
            soma=0;
            for (int i = 0; i < _chassi.Length-1; i++)
            {
                var cPart = _chassi[i];
                if (char.IsNumber(cPart))          
                {      
                    numero= int.Parse(cPart.ToString());
                    Console.WriteLine($"[{i}]: {numero.ToString()} é número");
                }
                else
                {
                    numero= GetValByLetter(cPart);
                    Console.WriteLine($"[{i}]: {cPart} NÃO é número");
                }
                switch (numero)
                {
                    case 1: case 11: soma += numero *8;break;
                    case 2:case 12:  soma +=   numero * 7;break;
                    case 3 :case 13:  soma +=   numero * 6;break;
                    case  4:case  14:  soma +=  numero * 5;break;
                    case 5: case 15:  soma +=   numero * 4;break;
                    case  6: case 16:  soma +=   numero * 3;break;
                    case 7:case 17:  soma +=   numero * 2;break;
                    case 8   :  soma +=   numero * 10;break;
                    case 9   :  soma +=   numero * 0;break;
                    case 10  :  soma +=   numero * 9; break;              
                    default:
                        break;
                }
                Console.WriteLine($"Soma: {soma}");
            
            }
            resto = (soma *10 ) % 11;
            Console.WriteLine($"Resto: {resto}");
            if (resto==10)
                digito="X";
            else            
                digito = resto.ToString();
            Console.WriteLine($"Digito: {digito}");    
            return digito== _chassi[8].ToString();
        }
        private int GetValByLetter(char letra)
        {
            int letraInt=0;
            switch (letra)
            {
                case 'A': letraInt=1;break;
                case 'B': letraInt=2;break;
                case 'C': letraInt=3;break;
                case 'D': letraInt=4;break;
                case 'E': letraInt=5;break;
                case 'F': letraInt=6;break;
                case 'G': letraInt=7;break;
                case 'H': letraInt=8;break;
                case 'I': letraInt=9;break;
                case 'J': letraInt=1;break;
                case 'K': letraInt=2;break;
                case 'L': letraInt=3;break;
                case 'M': letraInt=4;break;
                case 'N': letraInt=5;break;
                case 'O': letraInt=6;break;
                case 'P': letraInt=7;break;
                case 'Q': letraInt=8;break;
                case 'R': letraInt=9;break;
                case 'S': letraInt=2;break;
                case 'T': letraInt=3;break;
                case 'U': letraInt=4;break;
                case 'V': letraInt=5;break;
                case 'W': letraInt=6;break;
                case 'X': letraInt=7;break;
                case 'Y': letraInt=8;break;                 
                default:
                letraInt=9;break;   
            }
            return letraInt;
        }
    }
}