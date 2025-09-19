
public class lista13 {

	public static void main(String[] args) {
		// 1 - Contador: Mostre os números de 10 a 30
		class Contador {
		    public static void main(String[] args) {
		        for (int i = 10; i <= 30; i++) {
		            System.out.println(i);
		        }
		    }
		}

		// 2 - Classificação de Idades: 10 idades
		class ClassificacaoIdades {
		    public static void main(String[] args) {
		        Scanner scanner = new Scanner(System.in);
		        for (int i = 1; i <= 10; i++) {
		            System.out.print("Digite a idade " + i + ": ");
		            int idade = scanner.nextInt();
		            if (idade >= 18) {
		                System.out.println("Maior de idade");
		            } else {
		                System.out.println("Menor de idade");
		            }
		        }
		        scanner.close();
		    }
		}

		// 3 - Eleição: 5 votos
		class Eleicao {
		    public static void main(String[] args) {
		        Scanner scanner = new Scanner(System.in);
		        for (int i = 1; i <= 5; i++) {
		            System.out.print("Digite seu voto (1-4 candidatos, 5 nulo, 6 branco): ");
		            int voto = scanner.nextInt();
		            switch (voto) {
		                case 1 -> System.out.println("Voto no candidato 1");
		                case 2 -> System.out.println("Voto no candidato 2");
		                case 3 -> System.out.println("Voto no candidato 3");
		                case 4 -> System.out.println("Voto no candidato 4");
		                case 5 -> System.out.println("Voto Nulo");
		                case 6 -> System.out.println("Voto em Branco");
		                default -> System.out.println("Voto inválido");
		            }
		        }
		        scanner.close();
		    }
		}

		// 4 - Repetição de Frase
		class RepeticaoFrase {
		    public static void main(String[] args) {
		        Scanner scanner = new Scanner(System.in);
		        System.out.print("Digite uma frase: ");
		        String frase = scanner.nextLine();
		        System.out.print("Digite o número de repetições: ");
		        int n = scanner.nextInt();

		        for (int i = 1; i <= n; i++) {
		            System.out.println(frase);
		        }
		        scanner.close();
		    }
		}

		// 5 - Sequência: 50 até 30
		class Sequencia {
		    public static void main(String[] args) {
		        for (int i = 50; i >= 30; i--) {
		            System.out.println(i);
		        }
		    }
		}

		// 6 - Números Alternados: 1 a 50 pulando de 2 em 2
		class NumerosAlternados {
		    public static void main(String[] args) {
		        for (int i = 1; i <= 50; i += 2) {
		            System.out.println(i);
		        }
		    }
		}

		// 7 - Aprovado ou Reprovado: 5 notas
		class AprovadoReprovado {
		    public static void main(String[] args) {
		        Scanner scanner = new Scanner(System.in);
		        for (int i = 1; i <= 5; i++) {
		            System.out.print("Digite a nota " + i + ": ");
		            double nota = scanner.nextDouble();
		            if (nota >= 6) {
		                System.out.println("Aprovado");
		            } else {
		                System.out.println("Reprovado");
		            }
		        }
		        scanner.close();
		    }
		}

		// 8 - Categoria de Idade: 5 pessoas
		class CategoriaIdade {
		    public static void main(String[] args) {
		        Scanner scanner = new Scanner(System.in);
		        for (int i = 1; i <= 5; i++) {
		            System.out.print("Digite a idade da pessoa " + i + ": ");
		            int idade = scanner.nextInt();
		            if (idade <= 12) {
		                System.out.println("Criança");
		            } else if (idade <= 17) {
		                System.out.println("Adolescente");
		            } else if (idade <= 59) {
		                System.out.println("Adulto");
		            } else {
		                System.out.println("Idoso");
		            }
		        }
		   
		    }
		}

		// 9 - Número Positivo ou Negativo: 7 números
	
		        for (int i = 1; i <= 7; i++) {
		            System.out.print("Digite o número " + i + ": ");
		            int num = scanner.nextInt();
		            if (num > 0) {
		                System.out.println("Positivo");
		            } else if (num < 0) {
		                System.out.println("Negativo");
		            } else {
		                System.out.println("Zero");
		            }
		        }
		        
	}
}
	


