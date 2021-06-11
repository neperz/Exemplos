using System;

namespace Validador
{
    class Program
    {
        static void Main(string[] args)
        {
            string chassiToValidate ="";
            if (args.Length==0)
                chassiToValidate="9BGRD08X04G117974";
            else
                chassiToValidate = args[0].ToUpper();
            Console.WriteLine($"validando chassi {chassiToValidate}");
            ChassiValidator cv = new ChassiValidator(chassiToValidate);

            Console.WriteLine("Validação simples");
            var sv = cv.simple_validate_chassi(chassiToValidate);
            if (sv)
                Console.WriteLine("SV Chassi OK");
            else
                Console.WriteLine("SV Chassi Invalido");

            var result = cv.ValidarDigito();
            if (result)
            Console.WriteLine("Chassi OK");
            else
            Console.WriteLine("Chassi Invalido");

            
            bool valid = cv.Validate();
            string country = cv.getCountry(chassiToValidate.Substring(0, 3));
            Console.WriteLine($"VIN is valid? {valid}.");
           // if (valid) {
                Console.WriteLine($"Year is {cv.getYear(chassiToValidate[6].ToString(), chassiToValidate[9].ToString())}.");
                Console.WriteLine($"Manufacturer is {cv.getManufacturer(chassiToValidate.Substring(0, 3))} in ${country}.");
                if (country == "United States" || country == "Canada" || country == "Mexico") {
                    if (country == "United States" && chassiToValidate[2] == '9') {
                        Console.WriteLine($"Sequential number is {chassiToValidate.Substring(14)}.");
                    } else {
                        Console.WriteLine($"Sequential number is {chassiToValidate.Substring(11)}.");
                    }
                } else {
                    Console.WriteLine($"Sequential number is {chassiToValidate.Substring(12)}.");
                }
           // }            
        }
    }
}
