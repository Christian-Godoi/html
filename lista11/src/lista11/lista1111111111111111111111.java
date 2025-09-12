package lista11;

import java.util.Scanner;

public class lista1111111111111111111111 {

	public static void main(String[] args) {

		Scanner scanner = new Scanner(System.in);



		        // 1 - Contador
		        int cont1 = 1;
		        do {
		            System.out.println(cont1);
		            cont1 += 2;
		        } while (cont1 <= 31);
		        System.out.println("---------------------");

		        // 2 - Adivinhação de número
		        int numero2;
		        do {
		            System.out.print("Digite um número: ");
		            numero2 = scanner.nextInt();
		        } while (numero2 != 100);
		        System.out.println("Você acertou, o número é 100!");
		        System.out.println("---------------------");

		        // 3 - Menu interativo
		        int opcao;
		        do {
		            System.out.println("Menu:");
		            System.out.println("1 - Continuar");
		            System.out.println("2 - Sair");
		            System.out.print("Escolha: ");
		            opcao = scanner.nextInt();

		            if (opcao == 1) {
		                System.out.println("Você escolheu continuar!");
		            } else if (opcao != 2) {
		                System.out.println("Opção inválida! Tente novamente.");
		            }
		        } while (opcao != 2);
		        System.out.println("Programa encerrado!");
		        System.out.println("---------------------");

		        // 4 - Classificação de números (5 vezes)
		        int cont4 = 1;
		        do {
		            System.out.print("Digite o número " + cont4 + ": ");
		            int n = scanner.nextInt();
		            if (n < 10) {
		                System.out.println("Tipo A");
		            } else if (n < 20) {
		                System.out.println("Tipo B");
		            } else {
		                System.out.println("Fora da Categoria");
		            }
		            cont4++;
		        } while (cont4 <= 5);
		        System.out.println("---------------------");

		        // 5 - Temperatura do forno
		        int temp;
		        do {
		            System.out.print("Digite a temperatura do forno: ");
		            temp = scanner.nextInt();
		            if (temp >= 200) {
		                System.out.println("⚠️ Temperatura muito alta! Digite novamente.");
		            }
		        } while (temp >= 200);
		        System.out.println("✅ Temperatura segura!");
		        System.out.println("---------------------");

		        // 6 - Verificação de bateria
		        int bateria;
		        do {
		            System.out.print("Digite o nível da bateria (%): ");
		            bateria = scanner.nextInt();
		            if (bateria <= 20) {
		                System.out.println("🔋 Bateria baixa! Digite novamente.");
		            }
		        } while (bateria <= 20);
		        System.out.println("✅ Bateria suficiente!");
		        System.out.println("---------------------");

		        // 7 - Deseja fazer uma conta?
		        String resposta;
		        do {
		            System.out.print("Deseja fazer uma conta? (sim/não): ");
		            resposta = scanner.next();
		            if (resposta.equalsIgnoreCase("sim")) {
		                System.out.print("Digite o primeiro número: ");
		                int n1 = scanner.nextInt();
		                System.out.print("Digite o segundo número: ");
		                int n2 = scanner.nextInt();
		                System.out.println("Resultado da soma: " + (n1 + n2));
		            }
		        } while (resposta.equalsIgnoreCase("sim"));
		        System.out.println("Encerrado.");
}
	}


