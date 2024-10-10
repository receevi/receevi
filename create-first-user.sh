set -e
email=$1
first_name=$2
last_name=$3
curl -v -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE" -H "Content-Type: application/json" "$SUPABASE_URL/auth/v1/invite" -d "{\"email\": \"$email\", \"data\": { \"first_name\": \"$first_name\", \"last_name\": \"$last_name\", \"custom_user_role\": \"admin\"}}"
echo "Invite sent to $email"
