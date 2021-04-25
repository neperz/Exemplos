using System;

namespace Validador
{
    class Program
    {
        static void Main(string[] args)
        {
            string chassiToValidate = args[0];
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
