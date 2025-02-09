PGDMP      8                |         
   biblioteca    16.1    16.1     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    25765 
   biblioteca    DATABASE        CREATE DATABASE biblioteca WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Ecuador.1252';
    DROP DATABASE biblioteca;
                postgres    false            �            1259    33964    estudiantes    TABLE     �  CREATE TABLE public.estudiantes (
    cedula character varying(10) NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    sexo character(1),
    fecha_nacimiento date NOT NULL,
    sancionado boolean DEFAULT false,
    sancion_activa_hasta date,
    CONSTRAINT estudiantes_sexo_check CHECK ((sexo = ANY (ARRAY['M'::bpchar, 'F'::bpchar])))
);
    DROP TABLE public.estudiantes;
       public         heap    postgres    false            �            1259    33958    libros    TABLE     \  CREATE TABLE public.libros (
    codigo integer NOT NULL,
    tipo character varying(20) NOT NULL,
    categoria character varying(50) NOT NULL,
    editorial character varying(100) NOT NULL,
    nombre character varying(100) NOT NULL,
    autor character varying(100) NOT NULL,
    anio_publicacion integer NOT NULL,
    disponibilidad boolean
);
    DROP TABLE public.libros;
       public         heap    postgres    false            �            1259    33957    libros_codigo_seq    SEQUENCE     �   CREATE SEQUENCE public.libros_codigo_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.libros_codigo_seq;
       public          postgres    false    216            �           0    0    libros_codigo_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.libros_codigo_seq OWNED BY public.libros.codigo;
          public          postgres    false    215            �            1259    33972 	   prestamos    TABLE       CREATE TABLE public.prestamos (
    id integer NOT NULL,
    cedula_estudiante character varying(10),
    codigo_libro integer,
    fecha_prestamo date NOT NULL,
    fecha_entrega date NOT NULL,
    fecha_devolucion date,
    devuelto boolean DEFAULT false
);
    DROP TABLE public.prestamos;
       public         heap    postgres    false            �            1259    33971    prestamos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.prestamos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.prestamos_id_seq;
       public          postgres    false    219            �           0    0    prestamos_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.prestamos_id_seq OWNED BY public.prestamos.id;
          public          postgres    false    218            #           2604    33993    libros codigo    DEFAULT     n   ALTER TABLE ONLY public.libros ALTER COLUMN codigo SET DEFAULT nextval('public.libros_codigo_seq'::regclass);
 <   ALTER TABLE public.libros ALTER COLUMN codigo DROP DEFAULT;
       public          postgres    false    216    215    216            %           2604    33994    prestamos id    DEFAULT     l   ALTER TABLE ONLY public.prestamos ALTER COLUMN id SET DEFAULT nextval('public.prestamos_id_seq'::regclass);
 ;   ALTER TABLE public.prestamos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    219    219            �          0    33964    estudiantes 
   TABLE DATA           y   COPY public.estudiantes (cedula, nombre, apellido, sexo, fecha_nacimiento, sancionado, sancion_activa_hasta) FROM stdin;
    public          postgres    false    217   �       �          0    33958    libros 
   TABLE DATA           u   COPY public.libros (codigo, tipo, categoria, editorial, nombre, autor, anio_publicacion, disponibilidad) FROM stdin;
    public          postgres    false    216          �          0    33972 	   prestamos 
   TABLE DATA           �   COPY public.prestamos (id, cedula_estudiante, codigo_libro, fecha_prestamo, fecha_entrega, fecha_devolucion, devuelto) FROM stdin;
    public          postgres    false    219   �       �           0    0    libros_codigo_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.libros_codigo_seq', 1, false);
          public          postgres    false    215            �           0    0    prestamos_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.prestamos_id_seq', 61, true);
          public          postgres    false    218            +           2606    33970    estudiantes estudiantes_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_pkey PRIMARY KEY (cedula);
 F   ALTER TABLE ONLY public.estudiantes DROP CONSTRAINT estudiantes_pkey;
       public            postgres    false    217            )           2606    33963    libros libros_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.libros
    ADD CONSTRAINT libros_pkey PRIMARY KEY (codigo);
 <   ALTER TABLE ONLY public.libros DROP CONSTRAINT libros_pkey;
       public            postgres    false    216            -           2606    33978    prestamos prestamos_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.prestamos
    ADD CONSTRAINT prestamos_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.prestamos DROP CONSTRAINT prestamos_pkey;
       public            postgres    false    219            .           2606    33979 *   prestamos prestamos_cedula_estudiante_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.prestamos
    ADD CONSTRAINT prestamos_cedula_estudiante_fkey FOREIGN KEY (cedula_estudiante) REFERENCES public.estudiantes(cedula);
 T   ALTER TABLE ONLY public.prestamos DROP CONSTRAINT prestamos_cedula_estudiante_fkey;
       public          postgres    false    4651    219    217            /           2606    33984 %   prestamos prestamos_codigo_libro_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.prestamos
    ADD CONSTRAINT prestamos_codigo_libro_fkey FOREIGN KEY (codigo_libro) REFERENCES public.libros(codigo);
 O   ALTER TABLE ONLY public.prestamos DROP CONSTRAINT prestamos_codigo_libro_fkey;
       public          postgres    false    219    216    4649            �   i   x�37N�ļR΀����|N_N##]C#]c�8�В����������+51�381'=1E�)�#cC#KcN�Ĥ��TN�����̪DdM���b���� �"�      �   �   x�-�[
! ���*�
b�Z��\D�1�	�~�!H�8+k	m�	�?)�%�i���:e���uB�]_�.��a,qI��g�3�������y�8e�hѓpjЙsk�ÎPZ���U�Qk����q܎ǎ1��'�      �   Y   x�}���0CϰK*0!!�t��*�棶�,�=�$UJ��R� 'E�<����T�=�&�@t����mU�t�h�(W6Eߔ��΃�o��-     