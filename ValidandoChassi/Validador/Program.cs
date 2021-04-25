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
                chassiToValidate = args[0];
            Console.WriteLine($"validando chassi {chassiToValidate}");
            ChassiValidator cv = new ChassiValidator(chassiToValidate);
            var result = cv.Validar();
            if (result)
            Console.WriteLine("Chassi OK");
            else
            Console.WriteLine("Chassi Invalido");
        }
    }
}
