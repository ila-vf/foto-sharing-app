# Tunggu sampai MySQL tersedia
until nc -z -v -w30 db 3306
do
  echo "Menunggu database tersedia..."
  sleep 5
done

echo "Database tersedia, menjalankan server..."
node server.js