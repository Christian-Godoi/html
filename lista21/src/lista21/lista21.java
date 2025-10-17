package lista21;

public class lista21 {

	public static void main(String[] args) {

	    // 1 - Somar dois números inteiros
	    public static int somar(int a, int b) {
	        return a + b;
	    }

	    // 2 - Subtrair dois números inteiros
	    public static int subtrair(int a, int b) {
	        return a - b;
	    }

	    // 3 - Multiplicar dois números
	    public static double multiplicar(double a, double b) {
	        return a * b;
	    }

	    // 4 - Dividir dois números
	    public static String dividir(double a, double b) {
	        if (b == 0) {
	            return "Não é possível dividir por 0";
	        }
	        return "Resultado: " + (a / b);
	    }

	    // 5 - Calcular média de duas notas
	    public static double calcularMedia(double n1, double n2) {
	        return (n1 + n2) / 2;
	    }

	    // 6 - Verificar aprovação
	    public static String verificarAprovacao(double n1, double n2) {
	        double media = calcularMedia(n1, n2);
	        if (media >= 6) {
	            return "Aprovado";
	        } else {
	            return "Reprovado";
	        }
	    }

	    // 7 - Retornar o maior número
	    public static String maiorNumero(int a, int b) {
	        if (a > b) {
	            return "O maior número é: " + a;
	        } else if (b > a) {
	            return "O maior número é: " + b;
	        } else {
	            return "Eles são iguais";
	        }
	    }

	    // 8 - Converter Celsius para Fahrenheit
	    public static double converterCelsiusParaFahrenheit(double celsius) {
	        return (celsius * 9 / 5) + 32;
	    }

	    // 9 - Calcular área de um retângulo
	    public static double calcularAreaRetangulo(double base, double altura) {
	        return base * altura;
	    }

	    // 10 - Gerar mensagem com nome
	    public static String gerarMensagem(String nome) {
	        return "Olá, " + nome + "!";
	    }

	    // 11 - Juntar dois nomes
	    public static String juntarNomes(String nome1, String nome2) {
	        return nome1 + " " + nome2;
	    }

	    // 12 - Avaliar idade
	    public static String avaliarIdade(int idade) {
	        if (idade < 12) {
	            return "Criança";
	        } else if (idade < 18) {
	            return "Adolescente";
	        } else if (idade < 60) {
	            return "Adulto";
	        } else {
	            return "Idoso";
	        }
	    }
	}
